#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fancy_log_1 = require("fancy-log");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const isomor_core_1 = require("isomor-core");
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
function getCodes(fileName, content) {
    const codes = [];
    const { body } = typescript_estree_1.parse(content);
    body.forEach((element) => {
        if (element.type === 'ExportNamedDeclaration') {
            if (element.declaration.type === 'TSInterfaceDeclaration') {
                const code = content.substring(...element.range);
                codes.push(code);
            }
            else if (element.declaration.type === 'FunctionDeclaration') {
                const { name } = element.declaration.id;
                const code = `export function ${name}(...args: any) {\n  return remote('${fileName}', '${name}', args);\n}\n`;
                codes.push(code);
            }
            else if (element.declaration.type === 'VariableDeclaration') {
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
function transpile(options, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const { appFolder, serverFolder } = options;
        const file = path_1.basename(filePath);
        fancy_log_1.info('Transpile', file);
        const buffer = yield fs_extra_1.readFile(filePath);
        const fileName = path_1.parse(file).name;
        const codes = getCodes(fileName, buffer.toString());
        const appCode = `import { remote } from 'isomor';\n\n${codes.join(`\n`)}`;
        const appFilePath = path_1.join(appFolder, serverFolder, file);
        fancy_log_1.info('Create isomor file', appFilePath);
        yield fs_extra_1.outputFile(appFilePath, appCode);
    });
}
function prepare(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { srcFolder, appFolder, serverFolder } = options;
        fancy_log_1.info('Prepare folders');
        yield fs_extra_1.emptyDir(appFolder);
        yield fs_extra_1.copy(srcFolder, appFolder);
        yield fs_extra_1.emptyDir(path_1.join(appFolder, serverFolder));
    });
}
function start(options) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prepare(options);
        const { srcFolder, serverFolder } = options;
        const folder = path_1.join(srcFolder, serverFolder);
        fancy_log_1.info('Start transpiling');
        if (!(yield fs_extra_1.pathExists(folder))) {
            fancy_log_1.error('Folder does not exist', folder);
        }
        else {
            const files = yield isomor_core_1.getFiles(folder);
            files.forEach(file => transpile(options, file));
        }
    });
}
start({
    srcFolder: process.env.SRC_FOLDER || './src-isomor',
    appFolder: process.env.APP_FOLDER || './src',
    serverFolder: process.env.SERVER_FOLDER || '/server',
});
//# sourceMappingURL=index.js.map