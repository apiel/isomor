import { info, warn, log } from 'logol';
import { gray, yellow, red } from 'chalk';
import * as spawn from 'cross-spawn';
import { transformAsync } from '@babel/core';
import {
    readFile,
    outputFile,
    emptyDir,
    copy,
    unlink,
    outputJson,
    pathExists,
} from 'fs-extra';
import { join, basename, extname, dirname } from 'path';
import debug from 'debug';
import {
    // getFiles,
    getFolders,
    getPathForUrl,
    getFilesPattern,
} from 'isomor-core';
import { watch } from 'chokidar';
import { Options } from 'isomor-core';
import { promises as fs } from 'fs';

import { parse, generate } from './ast';
import transform from './transform';

// import anymatch from 'anymatch'; // ts issues https://github.com/micromatch/anymatch/issues/29
const anymatch = require('anymatch'); // tslint:disable-line

export default transform;

function getCode(
    options: Options,
    srcFilePath: string,
    path: string,
    content: string,
    declaration: boolean,
) {
    const {
        withTypes,
        noServerImport,
        noDecorator,
        pkgName,
        wsReg,
        wsBaseUrl,
        httpBaseUrl,
    } = options;
    const { program } = parse(content);
    program.body = transform(
        program.body,
        {
            srcFilePath,
            path,
            wsReg,
            pkgName,
            withTypes,
            wsBaseUrl,
            httpBaseUrl,
            declaration,
        },
        noServerImport,
        noDecorator,
    );
    const { code } = generate(program as any);

    return code;
}

async function transpile(options: Options, filePath: string) {
    const { distAppFolder, srcFolder, pkgName } = options;

    info('Transpile', filePath);
    const srcFilePath = join(srcFolder, filePath);
    const buffer = await readFile(srcFilePath);
    debug('isomor-transpiler:transpile:in')(buffer.toString());

    const moduleTsFile = join(distAppFolder, pkgName, filePath);
    const codeTs = getCode(
        options,
        srcFilePath,
        getPathForUrl(filePath),
        buffer.toString(),
        true,
    );

    info('Save isomor TS file', moduleTsFile);
    await outputFile(moduleTsFile, codeTs);
    debug('isomor-transpiler:transpile:out')(codeTs);

    const codeJs = getCode(
        options,
        srcFilePath,
        getPathForUrl(filePath),
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
    const { srcFolder, distAppFolder, serverFolder, skipCopySrc } = options;

    info('Prepare folders');
    if (!skipCopySrc) {
        await emptyDir(distAppFolder);
        await copy(srcFolder, distAppFolder);
    }

    // const folders = await getFolders(srcFolder, serverFolder);
    // await Promise.all(
    //     folders.map((folder) => emptyDir(join(distAppFolder, folder))),
    // );
}

// custom getFiles to be part of core
async function getFiles({ srcFolder }: Options) {
    const files = await fs.readdir(srcFolder, { withFileTypes: true });
    // ToDo get extensions from configs
    const extensions = ['.ts', '.js'];
    return files
        .filter((f) => f.isFile() && extensions.includes(extname(f.name)))
        .map((f) => f.name);
}

// ts to js
async function runTsc({ distAppFolder, srcFolder, pkgName }: Options) {
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
        `--outDir ${join(distAppFolder, pkgName, 'server')} -p tsconfig.json`.split(' '),
        srcFolder,
    );
}

export async function build(options: Options) {
    // await prepare(options);

    info('Start transpiling', options.pkgName);

    // const { srcFolder, serverFolder } = options;
    // const files = await getFiles(srcFolder, serverFolder);

    // options.srcFolder = join(__dirname, '..', 'src');
    options.srcFolder =
        '/home/alex/dev/node/pkg/isomor/packages/example/react/api';
    // options.distAppFolder = join(__dirname, '..', 'modules'); // should we rename it as modulePath / moduleFolder
    options.distAppFolder =
        '/home/alex/dev/node/pkg/isomor/packages/example/react/node_modules';
    // options.distServerFolder =
    //     '/home/alex/dev/node/pkg/isomor/packages/example/react/dist-server';
    options.pkgName = 'api'; // should rename it as moduleName
    const files = await getFiles(options);
    info(`Found ${files.length} file(s).`);

    await Promise.all(files.map((file) => transpile(options, file)));
    // --emitDeclarationOnly could be used for publishing a package
    await runTsc(options);

    watcher(options);
}

function getServerSubFolderPattern(serverFolderPattern: string) {
    return join(serverFolderPattern, '**', '*');
}

export const watcherUpdate = (options: Options) => async (file: string) => {
    const { srcFolder, serverFolder, distAppFolder, watchMode } = options;
    const serverFolderPattern = getFilesPattern(serverFolder);
    const path = join(srcFolder, file);

    if (anymatch(getServerSubFolderPattern(serverFolderPattern), path)) {
        info(`Do not copy sub-folder from "./server"`, path);
    } else if (anymatch(serverFolderPattern, path)) {
        transpile(options, file);
    } else {
        info(`Copy ${path} to folder`);
        const dest = join(distAppFolder, file);
        copy(path, dest);
        // const content = await readFile(path);
        // await outputFile(dest, content);

        if (watchMode) {
            // try to fix file that does not get copy correctly
            setTimeout(() => watcherUpdateSpy(path, dest), 200); // should not be necessary anymore
        }
    }
};

async function watcherUpdateSpy(path: string, dest: string, retry = 0) {
    const contentA = await readFile(path);
    const contentB = await readFile(dest);
    if (contentA.toString() !== contentB.toString()) {
        warn('We found file diff, copy again', dest);
        await outputFile(dest, contentA);
        if (retry < 2) {
            setTimeout(() => watcherUpdateSpy(path, dest, retry + 1), 200);
        }
    }
}

function watcher(options: Options) {
    const { srcFolder, serverFolder, watchMode, distAppFolder } = options;
    if (watchMode) {
        info('Starting watch mode.');
        const serverFolderPattern = getFilesPattern(serverFolder);
        watch('.', {
            ignoreInitial: true,
            ignored: getServerSubFolderPattern(serverFolderPattern),
            cwd: srcFolder,
            usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
        })
            .on('ready', () =>
                info('Initial scan complete. Ready for changes...'),
            )
            .on('add', (file) => {
                info(`File ${file} has been added`);
                // watcherUpdate(file);
                setTimeout(() => watcherUpdate(options)(file), 100);
            })
            .on('change', (file) => {
                info(`File ${file} has been changed`);
                // watcherUpdate(file);
                setTimeout(() => watcherUpdate(options)(file), 100);
            })
            .on('unlink', (file) => {
                info(`File ${file} has been removed`, '(do nothing)');
                const path = join(distAppFolder, file);
                unlink(path);
            });
    }
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
