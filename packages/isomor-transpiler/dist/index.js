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
function getFunctions(content) {
    const functions = [];
    const finFuncPattern = /export(\s+async){0,1}\s+function\s+(.*)\(.*\).*\s*\{/gim;
    while (true) {
        const findFunc = finFuncPattern.exec(content);
        if (findFunc) {
            const code = findFunc[0].replace(/\(.*\)/gim, '(...args: any)');
            functions.push({ name: findFunc[2], code });
        }
        else {
            break;
        }
    }
    return functions;
}
function transpile(options, file) {
    return __awaiter(this, void 0, void 0, function* () {
        const { folder, appFolder } = options;
        const filePath = path_1.join(folder, file);
        fancy_log_1.info('Transpile', file);
        const buffer = yield fs_extra_1.readFile(filePath);
        const functions = getFunctions(buffer.toString());
        const fileName = path_1.parse(file).name;
        const appFunctions = functions.map(({ code, name }) => `${code}\n  return remote('${fileName}', '${name}', args);\n}\n`);
        const appCode = `import { remote } from 'isomor';\n\n${appFunctions.join(`\n`)}`;
        const appFilePath = path_1.join(appFolder, file);
        yield fs_extra_1.outputFile(appFilePath, appCode);
    });
}
function start(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { folder } = options;
        fancy_log_1.info('Start transpiling');
        if (!(yield fs_extra_1.pathExists(folder))) {
            fancy_log_1.error('Folder does not exist', folder);
        }
        else {
            const files = yield fs_extra_1.readdir(folder);
            files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                const filePath = path_1.join(folder, file);
                const ls = yield fs_extra_1.lstat(filePath);
                if (ls.isFile()) {
                    transpile(options, file);
                }
            }));
        }
    });
}
start({
    folder: process.env.FOLDER || path_1.join(__dirname, '../example'),
    appFolder: process.env.APP_FOLDER || path_1.join(__dirname, '../dist-app'),
});
//# sourceMappingURL=index.js.map