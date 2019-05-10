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
const pkg = require('../package.json');
require('please-upgrade-node')(pkg, {
    message: (v) => `
    ┌─────────────────────────────────────────────────────────┐
    │ isomor-transpiler requires at least version ${v} of Node. │
    │                     Please upgrade.                     │
    └─────────────────────────────────────────────────────────┘
    `,
});
const logol_1 = require("logol");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const debug_1 = require("debug");
const isomor_core_1 = require("isomor-core");
const chokidar_1 = require("chokidar");
const anymatch = require("anymatch");
const ast_1 = require("./ast");
const transform_1 = require("./transform");
exports.default = transform_1.default;
function getCode(options, path, content) {
    const { withTypes, noServerImport } = options;
    const { program } = ast_1.parse(content);
    program.body = transform_1.default(program.body, path, withTypes, noServerImport);
    const { code } = ast_1.generate(program);
    return code;
}
function transpile(options, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const { distAppFolder, srcFolder } = options;
        logol_1.info('Transpile', filePath);
        const buffer = yield fs_extra_1.readFile(path_1.join(srcFolder, filePath));
        debug_1.default('isomor-transpiler:transpile:in')(buffer.toString());
        const code = getCode(options, isomor_core_1.getPathForUrl(filePath), buffer.toString());
        const appFilePath = path_1.join(distAppFolder, filePath);
        logol_1.info('Save isomor file', appFilePath);
        yield fs_extra_1.outputFile(appFilePath, code);
        debug_1.default('isomor-transpiler:transpile:out')(code);
    });
}
function prepare(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { srcFolder, distAppFolder, serverFolder } = options;
        logol_1.info('Prepare folders');
        yield fs_extra_1.emptyDir(distAppFolder);
        yield fs_extra_1.copy(srcFolder, distAppFolder);
        const folders = yield isomor_core_1.getFolders(srcFolder, serverFolder);
        yield Promise.all(folders.map(folder => fs_extra_1.emptyDir(path_1.join(distAppFolder, folder))));
    });
}
function start(options) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prepare(options);
        logol_1.info('Start transpiling');
        const { srcFolder, serverFolder } = options;
        const files = yield isomor_core_1.getFiles(srcFolder, serverFolder);
        logol_1.info(`Found ${files.length} file(s).`);
        yield Promise.all(files.map(file => transpile(options, file)));
        watcher(options);
    });
}
function watcher(options) {
    const { srcFolder, serverFolder, distAppFolder, watchMode } = options;
    if (watchMode) {
        logol_1.info('Starting watch mode.');
        const serverFolderPattern = isomor_core_1.getFilesPattern(serverFolder);
        chokidar_1.watch('.', {
            ignoreInitial: true,
            ignored: path_1.join(serverFolderPattern, '**', '*'),
            cwd: srcFolder,
            usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
        }).on('ready', () => logol_1.info('Initial scan complete. Ready for changes...'))
            .on('add', file => {
            logol_1.info(`File ${file} has been added`);
            setTimeout(() => watcherUpdate(file), 100);
        }).on('change', file => {
            logol_1.info(`File ${file} has been changed`);
            setTimeout(() => watcherUpdate(file), 100);
        }).on('unlink', file => {
            logol_1.info(`File ${file} has been removed`, '(do nothing)');
            setTimeout(() => watcherUpdate(file), 100);
        });
        function watcherUpdate(file) {
            return __awaiter(this, void 0, void 0, function* () {
                const path = path_1.join(srcFolder, file);
                if (anymatch([serverFolderPattern], path)) {
                    transpile(options, file);
                }
                else {
                    logol_1.info(`Copy ${path} to folder`);
                    const dest = path_1.join(distAppFolder, file);
                    fs_extra_1.copy(path, dest);
                    setTimeout(() => watcherUpdateSpy(path, dest), 200);
                }
            });
        }
        function watcherUpdateSpy(path, dest, retry = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                const contentA = yield fs_extra_1.readFile(path);
                const contentB = yield fs_extra_1.readFile(dest);
                if (contentA.toString() !== contentB.toString()) {
                    logol_1.warn('We found file diff, copy again', dest);
                    yield fs_extra_1.outputFile(dest, contentA);
                    if (retry < 2) {
                        setTimeout(() => watcherUpdateSpy(path, dest, retry + 1), 200);
                    }
                }
            });
        }
    }
}
start({
    srcFolder: process.env.SRC_FOLDER || './src-isomor',
    distAppFolder: process.env.DIST_APP_FOLDER || './src',
    serverFolder: process.env.SERVER_FOLDER || '/server',
    withTypes: process.env.NO_TYPES !== 'true',
    watchMode: process.env.WATCH === 'true',
    noServerImport: process.env.No_SERVER_IMPORT === 'true',
});
//# sourceMappingURL=index.js.map