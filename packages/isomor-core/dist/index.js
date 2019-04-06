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
function getFiles(rootFolder, folderToSearch) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield fs_extra_1.pathExists(rootFolder)) {
            const files = yield glob(path_1.join(rootFolder, '**', folderToSearch, '*'), { nodir: true });
            const start = rootFolder.length - 1;
            return files.map(file => file.substring(start));
        }
        return [];
    });
}
exports.getFiles = getFiles;
function getFolders(rootFolder, folderToSearch) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield fs_extra_1.pathExists(rootFolder)) {
            const files = yield glob(path_1.join(rootFolder, '**', folderToSearch));
            const start = rootFolder.length - 1;
            return files.map(file => file.substring(start));
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