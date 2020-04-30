import { info, warn } from 'logol';
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

const tmpPath = '/home/alex/dev/node/pkg/isomor/packages/isomor-transpiler/tmp';
const srcPath = '/home/alex/dev/node/pkg/isomor/packages/isomor-transpiler/src';
// const modulePath =
//     '/home/alex/dev/node/pkg/isomor/packages/example/react/node_modules';
const modulePath =
    '/home/alex/dev/node/pkg/isomor/packages/isomor-transpiler/modules';
const moduleName = 'api';

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

async function transpile(
    options: Options,
    filePath: string,
) {
    const { distAppFolder, srcFolder } = options;

    info('Transpile', filePath);
    const srcFilePath = join(srcFolder, filePath);
    const buffer = await readFile(srcFilePath);
    debug('isomor-transpiler:transpile:in')(buffer.toString());

    const moduleTsFile = join(modulePath, moduleName, filePath);
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

    const moduleJsFile = join(dirname(moduleTsFile), basename(moduleTsFile, extname(moduleTsFile)) + '.js');
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
    return files.filter((f) => f.isFile()).map((f) => f.name);
}

// ts to js
async function runTsc({ distAppFolder }: Options, declaration: boolean) {
    info('Run tsc');
    const tsconfig = {
        compilerOptions: {
            target: 'es5',
            lib: ['esnext'],
            strict: true,
            allowJs: true,
            declaration,
            downlevelIteration: true,
        },
    };
    const dist = join(distAppFolder, declaration ? 'd.ts' : 'src');
    await outputJson(join(dist, 'tsconfig.json'), tsconfig);
    return shell(
        'tsc',
        `--outDir ${join(modulePath, moduleName)} -p tsconfig.json`.split(' '),
        dist,
    );
}

export async function build(options: Options) {
    // await prepare(options);

    info('Start transpiling', options.pkgName);

    // const { srcFolder, serverFolder } = options;
    // const files = await getFiles(srcFolder, serverFolder);

    // for testing let overwrite options
    options.srcFolder = srcPath;
    // options.distAppFolder = join(modulePath, moduleName);
    options.distAppFolder = tmpPath; // for the moment go there till it is done properly
    const files = await getFiles(options);
    info(`Found ${files.length} file(s).`);

    // --emitDeclarationOnly
    await Promise.all(files.map((file) => transpile(options, file)));
    // await runTsc(options, true);
    // await Promise.all(files.map((file) => transpile(options, file, false)));
    // await runTsc(options, false);

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
