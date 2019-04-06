#!/usr/bin/env node

import { info } from 'fancy-log'; // fancy log not so fancy, i want colors :D
import { readFile, outputFile, emptyDir, copy } from 'fs-extra';
import { join, parse as parseFile, basename } from 'path';
import { getFiles, getFolders, getPathForUrl } from 'isomor-core';
import { parse } from '@typescript-eslint/typescript-estree';
import generate from '@babel/generator';
import transform from './transform';

export { transform };

interface Options {
    srcFolder: string;
    distFolder: string;
    serverFolder: string;
    withTypes: boolean;
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
    const { distFolder, srcFolder } = options;

    info('Transpile', filePath);
    const buffer = await readFile(join(srcFolder, filePath));

    const code = getCode(options, getPathForUrl(filePath), buffer.toString());

    const appFilePath = join(distFolder, filePath);
    info('Create isomor file', appFilePath);
    await outputFile(appFilePath, code);
}

async function prepare(options: Options) {
    const { srcFolder, distFolder, serverFolder } = options;

    info('Prepare folders');
    await emptyDir(distFolder);
    await copy(srcFolder, distFolder);

    const folders = await getFolders(srcFolder, serverFolder);
    await Promise.all(folders.map(folder => emptyDir(join(distFolder, folder))));
}

async function start(options: Options) {
    await prepare(options);

    info('Start transpiling');

    const { srcFolder, serverFolder } = options;
    const files = await getFiles(srcFolder, serverFolder);
    info(`Found ${files.length} file(s).`);
    files.forEach(file => transpile(options, file));
}

start({
    srcFolder: process.env.SRC_FOLDER || './src-isomor',
    distFolder: process.env.DIST_FOLDER || './src',
    serverFolder: process.env.SERVER_FOLDER || '/server',
    withTypes: process.env.WITH_TYPES === 'false' ? false : true,
});
