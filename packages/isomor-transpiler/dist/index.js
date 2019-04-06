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
const generator_1 = require("@babel/generator");
const transform_1 = require("./transform");
exports.transform = transform_1.default;
function getCode(options, fileName, content) {
    const { withTypes } = options;
    const program = typescript_estree_1.parse(content);
    program.body = transform_1.default(program.body, fileName, withTypes);
    const { code } = generator_1.default(program);
    return code;
}
function transpile(options, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const { appFolder, serverFolder } = options;
        const file = path_1.basename(filePath);
        fancy_log_1.info('Transpile', file);
        const buffer = yield fs_extra_1.readFile(filePath);
        const fileName = path_1.parse(file).name;
        const code = getCode(options, fileName, buffer.toString());
        const appFilePath = path_1.join(appFolder, serverFolder, file);
        fancy_log_1.info('Create isomor file', appFilePath);
        yield fs_extra_1.outputFile(appFilePath, code);
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
    withTypes: process.env.WITH_TYPES === 'false' ? false : true,
});
//# sourceMappingURL=index.js.map