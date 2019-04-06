#!/usr/bin/env node

import { info, error as err } from 'fancy-log'; // fancy log not so fancy, i want colors :D
import { pathExists, readFile, outputFile, emptyDir, copy, writeFile, unlink } from 'fs-extra';
import { join, parse as parseFile, basename } from 'path';
import { getFiles } from 'isomor-core';
import { parse } from '@typescript-eslint/typescript-estree';
import generate from '@babel/generator';
import transform from './transform';

export { transform };

interface Options {
    srcFolder: string;
    appFolder: string;
    serverFolder: string;
    withTypes: boolean;
}

interface Func {
    name: string;
    code: string;
}

function getCode(options: Options, fileName: string, content: string) {
    const { withTypes } = options;
    const program = parse(content);
    program.body = transform(program.body, fileName, withTypes);
    const { code } = generate(program as any);

    return code;
}

async function transpile(options: Options, filePath: string) {
    const { appFolder, serverFolder } = options;
    const file = basename(filePath);

    info('Transpile', file);
    const buffer = await readFile(filePath);

    const fileName = parseFile(file).name;
    const code = getCode(options, fileName, buffer.toString());

    const appFilePath = join(appFolder, serverFolder, file);
    info('Create isomor file', appFilePath);
    // await writeFile(appFilePath, appCode);
    // await unlink(appFilePath);
    await outputFile(appFilePath, code);
}

async function prepare(options: Options) {
    const { srcFolder, appFolder, serverFolder } = options;

    info('Prepare folders');
    await emptyDir(appFolder);
    await copy(srcFolder, appFolder);
    await emptyDir(join(appFolder, serverFolder));
}

async function start(options: Options) {
    await prepare(options);

    const { srcFolder, serverFolder } = options;
    const folder = join(srcFolder, serverFolder);
    info('Start transpiling');
    if (!(await pathExists(folder))) {
        err('Folder does not exist', folder);
    } else {
        const files: string[] = await getFiles(folder);
        files.forEach(file => transpile(options, file));
    }
}

start({
    srcFolder: process.env.SRC_FOLDER || './src-isomor',
    appFolder: process.env.APP_FOLDER || './src',
    serverFolder: process.env.SERVER_FOLDER || '/server',
    withTypes: process.env.WITH_TYPES === 'false' ? false : true,
});
