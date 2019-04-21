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
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const Glob = require("glob");
const util_1 = require("util");
const glob = util_1.promisify(Glob);
function getFilesPattern(rootFolder, folderToSearch) {
    return path_1.join(rootFolder, '**', folderToSearch, '*');
}
exports.getFilesPattern = getFilesPattern;
function trimSlash(path) {
    return path.replace(/^\/|\/$/g, '');
}
function trimRootFolder(rootFolder) {
    const start = trimSlash(rootFolder).length - 1;
    return (file) => trimSlash(file.substring(start));
}
exports.trimRootFolder = trimRootFolder;
function getFiles(rootFolder, folderToSearch) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield fs_extra_1.pathExists(rootFolder)) {
            const files = yield glob(getFilesPattern('', folderToSearch), {
                nodir: true,
                cwd: rootFolder,
            });
            return files;
        }
        return [];
    });
}
exports.getFiles = getFiles;
function getFolders(rootFolder, folderToSearch) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield fs_extra_1.pathExists(rootFolder)) {
            const files = yield glob(path_1.join('**', folderToSearch), {
                cwd: rootFolder,
            });
            return files;
        }
        return [];
    });
}
exports.getFolders = getFolders;
function getPathForUrl(filePath) {
    const extensionLen = path_1.extname(filePath).length;
    return filePath.replace(/\//g, '-').slice(0, -extensionLen);
}
exports.getPathForUrl = getPathForUrl;
//# sourceMappingURL=index.js.map