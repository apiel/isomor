#!/usr/bin/env node

import { info, error as err } from 'fancy-log'; // fancy log not so fancy, i want colors :D
import { pathExists, readFile, outputFile } from 'fs-extra';
import { join, parse as parseFile, basename } from 'path';
import { getFiles } from 'isomor-core';
import { parse } from '@typescript-eslint/typescript-estree';

interface Options {
    folder: string;
    appFolder: string;
}

interface Func {
    name: string;
    code: string;
}

function getCodes(fileName: string, content: string) {
    const codes: string[] = [];
    const { body } = parse(content);
    body.forEach((element) => {
        if (element.type === 'ExportNamedDeclaration') {
            if (element.declaration.type === 'TSInterfaceDeclaration') {
                const code = content.substring(...element.range);
                codes.push(code);
            } else if (element.declaration.type === 'FunctionDeclaration') {
                const { name } = element.declaration.id;
                const code = `export function ${name}(...args: any) {\n  return remote('${fileName}', '${name}', args);\n}\n`;
                codes.push(code);
            } else if (element.declaration.type === 'VariableDeclaration') {
                const { declarations } = element.declaration;
                const declaration = declarations[0];
                if (declaration.type === 'VariableDeclarator'
                    && declaration.init.type === 'ArrowFunctionExpression'
                    && declaration.id.type === 'Identifier') {

                    const { name } = declaration.id;
                    const code = `export const ${name} = (...args: any) => {\n  return remote('${fileName}', '${name}', args);\n}\n`;
                    codes.push(code);
                }
            }
        }
    });
    return codes;
}

async function transpile(options: Options, filePath: string) {
    const { appFolder } = options;
    const file = basename(filePath);

    info('Transpile', file);
    const buffer = await readFile(filePath);

    const fileName = parseFile(file).name;
    const codes = getCodes(fileName, buffer.toString());

    const appCode = `import { remote } from 'isomor';\n\n${codes.join(`\n`)}`;
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
