#!/usr/bin/env node

import { info, error as err } from 'fancy-log'; // fancy log not so fancy, i want colors :D
import { readdir, pathExists, lstat, readFile, outputFile } from 'fs-extra';
import { join, parse, basename } from 'path';
import { getFiles } from 'isomor-core';

interface Options {
    folder: string;
    appFolder: string;
}

interface Func {
    name: string;
    code: string;
}

function getFunctions(content: string) {
    const functions: Func[] = [];
    // only support "function" not array func
    const finFuncPattern = /export(\s+async){0,1}\s+function\s+(.*)\(.*\).*\s*\{/gim;
    // it's hardly possible to conver all poissibilty just with regex
    // will need to create a more complex parser, maybe combine with prettier
    // https://github.com/prettier/prettier/blob/master/src/language-js/parser-typescript.js
    // or even better maybe just
    // @typescript-eslint/typescript-estree
    while (true) {
        const findFunc = finFuncPattern.exec(content);
        if (findFunc) {
            const code: string = findFunc[0].replace(/\(.*\)/gim, '(...args: any)');
            functions.push({ name: findFunc[2], code });
        } else {
            break;
        }
    }
    return functions;
}

async function transpile(options: Options, filePath: string) {
    const { appFolder } = options;
    const file = basename(filePath);

    info('Transpile', file);
    const buffer = await readFile(filePath);
    const functions = getFunctions(buffer.toString());
    // console.log('functions', functions);

    const fileName = parse(file).name;
    const appFunctions = functions.map(
        ({ code, name }) => `${code}\n  return remote('${fileName}', '${name}', args);\n}\n`,
    );
    const appCode = `import { remote } from 'isomor';\n\n${appFunctions.join(`\n`)}`;
    const appFilePath = join(appFolder, file);
    await outputFile(appFilePath, appCode);
}

async function start(options: Options) {
    // should move this in core
    const { folder } = options;
    info('Start transpiling');
    if (!(await pathExists(folder))) {
        err('Folder does not exist', folder);
    } else {
        const files: string[] = await getFiles(folder);
        files.forEach(file => transpile(options, file));
    }

}

start({
    folder: process.env.FOLDER || join(__dirname, '../example'),
    appFolder: process.env.APP_FOLDER || join(__dirname, '../dist-app'),
});
