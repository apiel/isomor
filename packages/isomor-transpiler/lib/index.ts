#!/usr/bin/env node

import { info } from 'fancy-log'; // fancy log not so fancy, i want colors :D
import { readFile, outputFile, emptyDir, copy, unlink } from 'fs-extra';
import { join } from 'path';
import {
    getFiles,
    getFolders,
    getPathForUrl,
    getFilesPattern,
} from 'isomor-core';
import { watch } from 'chokidar';
import * as anymatch from 'anymatch';
// we most likely don't need this 2 guys by using ts.createSourceFile...
import { parse } from '@typescript-eslint/typescript-estree';
import generate from '@babel/generator';

import transform from './transform';

export default transform;

interface Options {
    srcFolder: string;
    distAppFolder: string;
    serverFolder: string;
    withTypes: boolean;
    watchMode: boolean;
}

interface Func {
    name: string;
    code: string;
}

function getCode(options: Options, path: string, content: string) {
    const { withTypes } = options;
    const program = parse(content);
    program.body = transform(program.body, path, withTypes);
    const { code } = generate(program as any);

    return code;
}

async function transpile(options: Options, filePath: string) {
    const { distAppFolder, srcFolder } = options;

    info('Transpile', filePath);
    const buffer = await readFile(join(srcFolder, filePath));

    const code = getCode(options, getPathForUrl(filePath), buffer.toString());

    const appFilePath = join(distAppFolder, filePath);
    info('Save isomor file', appFilePath);
    await outputFile(appFilePath, code);
}

async function prepare(options: Options) {
    const { srcFolder, distAppFolder, serverFolder } = options;

    info('Prepare folders');
    await emptyDir(distAppFolder);
    await copy(srcFolder, distAppFolder);

    const folders = await getFolders(srcFolder, serverFolder);
    await Promise.all(folders.map(folder => emptyDir(join(distAppFolder, folder))));
}

async function start(options: Options) {
    await prepare(options);

    info('Start transpiling');

    const { srcFolder, serverFolder } = options;
    const files = await getFiles(srcFolder, serverFolder);
    info(`Found ${files.length} file(s).`);
    await Promise.all(files.map(file => transpile(options, file)));

    watcher(options);
}

function watcher(options: Options) {
    const { srcFolder, serverFolder, distAppFolder, watchMode } = options;
    if (watchMode) {
        info('Starting watch mode.');
        const serverFolderPattern = getFilesPattern(serverFolder);
        watch('.', {
            ignoreInitial: true,
            ignored: join(serverFolderPattern, '**', '*'),
            cwd: srcFolder,
        }).on('ready', () => info('Initial scan complete. Ready for changes...'))
            .on('add', file => {
                info(`File ${file} has been added`);
                watcherUpdate(file);
            }).on('change', file => {
                info(`File ${file} has been changed`);
                watcherUpdate(file);
            }).on('unlink', file => {
                info(`File ${file} has been removed`, '(do nothing)');
                unlink(join(distAppFolder, file));
            });

        function watcherUpdate(file: string) {
            const path = join(srcFolder, file);
            if (anymatch([serverFolderPattern], path)) {
                transpile(options, file);
            } else {
                info(`Copy ${path} to folder`);
                copy(path, join(distAppFolder, file));
            }
        }
    }
}

start({
    srcFolder: process.env.SRC_FOLDER || './src-isomor',
    distAppFolder: process.env.DIST_APP_FOLDER || './src',
    serverFolder: process.env.SERVER_FOLDER || '/server',
    withTypes: process.env.NO_TYPES !== 'true',
    watchMode: process.env.WATCH === 'true',
});
