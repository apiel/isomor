import { info, log } from 'logol';
import { gray, yellow, red } from 'chalk';
import * as spawn from 'cross-spawn';
import { transformAsync } from '@babel/core';
import {
    readFile,
    outputFile,
    emptyDir,
    unlink,
    outputJson,
    pathExists,
} from 'fs-extra';
import { join, basename, extname, dirname } from 'path';
import debug from 'debug';
import { getFiles } from 'isomor-core';
import { Options } from 'isomor-core';

import { parse, generate } from './ast';
import transform from './transform';
import { FnOptions } from './transformNode';

export default transform;

function getCode(
    options: Options,
    srcFilePath: string,
    content: string,
    declaration: boolean,
) {
    const { wsReg, wsBaseUrl, httpBaseUrl, moduleName } = options;
    const { program } = parse(content);

    const fnOptions: FnOptions = {
        srcFilePath,
        wsReg,
        moduleName,
        wsBaseUrl,
        httpBaseUrl,
        declaration,
    };

    program.body = transform(
        program.body,
        fnOptions,
    );
    const { code } = generate(program as any);

    return code;
}

async function transpile(options: Options, filePath: string) {
    const { moduleFolder, srcFolder, moduleName } = options;

    info('Transpile', filePath);
    const srcFilePath = join(srcFolder, filePath);
    const buffer = await readFile(srcFilePath);
    debug('isomor-transpiler:transpile:in')(buffer.toString());

    // ToDo generate TS file only if TS
    const moduleTsFile = join(moduleFolder, moduleName, filePath);
    const codeTs = getCode(
        options,
        srcFilePath,
        buffer.toString(),
        true,
    );

    info('Save isomor TS file', moduleTsFile);
    await outputFile(moduleTsFile, codeTs);
    debug('isomor-transpiler:transpile:out')(codeTs);

    const codeJs = getCode(
        options,
        srcFilePath,
        buffer.toString(),
        false,
    );
    const { code } = await transformAsync(codeJs, {
        filename: filePath,
        presets: ['@babel/preset-typescript', '@babel/preset-env'],
    });

    const moduleJsFile = join(
        dirname(moduleTsFile),
        basename(moduleTsFile, extname(moduleTsFile)) + '.js',
    );
    info('Save isomor JS file', moduleJsFile);
    await outputFile(moduleJsFile, code);
    debug('isomor-transpiler:transpile:out')(code);
}

async function prepare(options: Options) {
    const {
        jsonSchemaFolder,
        serverFolder,
        moduleFolder,
        extensions,
    } = options;

    info('Prepare folders');
    await emptyDir(jsonSchemaFolder);
    await emptyDir(serverFolder);
    // await emptyDir(moduleFolder); // maybe should only remove ts and js
    const files = await getFiles(moduleFolder, extensions);
    await Promise.all(files.map((file) => unlink(join(moduleFolder, file))));
}

async function runTsc({ serverFolder, srcFolder }: Options) {
    info('Transpile server');
    const tsConfigFile = join(srcFolder, 'tsconfig.json');
    if (!(await pathExists(tsConfigFile))) {
        const tsconfig = {
            compilerOptions: {
                types: ['node'],
                module: 'commonjs',
                declaration: false,
                removeComments: true,
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                target: 'es6',
                sourceMap: false,
            },
        };
        await outputJson(tsConfigFile, tsconfig);
    }
    return shell(
        'tsc',
        `--outDir ${serverFolder} -p tsconfig.json`.split(' '),
        srcFolder,
    );
}

export async function build(options: Options) {
    await prepare(options);

    info('Start transpiling', options.moduleName);

    const { srcFolder, extensions, skipBuildServer } = options;
    const files = await getFiles(srcFolder, extensions);
    info(`Found ${files.length} file(s).`);

    await Promise.all(files.map((file) => transpile(options, file)));
    // --emitDeclarationOnly could be used for publishing a package
    if (!skipBuildServer) {
        await runTsc(options);
    }
    // ToDo fix watcher since it is much more simple now
    // watcher(options);
}

function shell(
    command: string,
    args?: ReadonlyArray<string>,
    cwd: string = process.cwd(),
    env?: NodeJS.ProcessEnv,
) {
    log('Run shell cmd', { cmd: `${command} ${args.join(' ')}`, cwd });
    return new Promise((resolve) => {
        const cmd = spawn(command, args, {
            cwd,
            env: {
                COLUMNS:
                    process.env.COLUMNS || process.stdout.columns.toString(),
                LINES: process.env.LINES || process.stdout.rows.toString(),
                ...env,
                ...process.env,
            },
        });
        cmd.stdout.on('data', (data) => {
            process.stdout.write(gray(data.toString()));
        });
        cmd.stderr.on('data', (data) => {
            const dataStr = data.toString();
            if (dataStr.indexOf('warning') === 0) {
                process.stdout.write(yellow('warming') + dataStr.substring(7));
            } else {
                process.stdout.write(red(data.toString()));
            }
        });
        cmd.on('close', (code) => (code ? process.exit(code) : resolve()));
    });
}
