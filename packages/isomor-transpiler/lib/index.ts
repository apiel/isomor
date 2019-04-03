#!/usr/bin/env node

import { info, error as err } from 'fancy-log'; // fancy log not so fancy, i want colors :D
import { pathExists, readFile, outputFile } from 'fs-extra';
import { join, parse as parseFile, basename } from 'path';
import { getFiles } from 'isomor-core';
import { parse } from '@typescript-eslint/typescript-estree';
import { type } from 'os';

interface Options {
    folder: string;
    appFolder: string;
}

interface Func {
    name: string;
    code: string;
}

function getStuff(content: string) {
    const { body } = parse(content);
    body.forEach((element) => {
        console.log('------');
        if (element.type === 'ExportNamedDeclaration') {
            if (element.declaration.type === 'TSInterfaceDeclaration') {
                console.log('found export interface at', element.loc);
            } else if (element.declaration.type === 'FunctionDeclaration') {
                console.log('found export function with name', element.declaration.id.name, 'at loc ', element.loc);
                console.log('async', element.declaration.async);
                console.log('params', element.declaration.params.map(({ loc }) => loc));
                console.log('body start', element.declaration.body.loc.start);
            } else if (element.declaration.type === 'VariableDeclaration') {
                const { declarations } = element.declaration;
                const declaration = declarations[0];
                if (declaration.type === 'VariableDeclarator' && declaration.init.type === 'ArrowFunctionExpression') {
                    console.log('export start at', element.loc);
                    console.log('found arrow func', declaration.init.loc);
                    console.log('body', declaration.init.body.loc.start);
                    console.log('params', declaration.init.params.map(({ loc }) => loc));
                }
            }
        }
    });
}

function getFunctions(content: string) {
    const functions: Func[] = [];
    // only support "function" not array func
    const findFuncPattern = /export(\s+async){0,1}\s+function\s+(.*)\(.*\).*\s*\{/gim;
    // const findInterfacePattern = /export(\s+async){0,1}\s+function\s+(.*)\(.*\).*\s*\{/gim;
    // it's hardly possible to conver all poissibilty just with regex
    // will need to create a more complex parser, maybe combine with prettier
    // https://github.com/prettier/prettier/blob/master/src/language-js/parser-typescript.js
    // or even better maybe just
    // @typescript-eslint/typescript-estree
    while (true) {
        const findFunc = findFuncPattern.exec(content);
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
    getStuff(buffer.toString());
    const functions = getFunctions(buffer.toString());
    // console.log('functions', functions);

    const fileName = parseFile(file).name;
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
