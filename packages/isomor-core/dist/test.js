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
const path_1 = require("path");
const Glob = require("glob");
const util_1 = require("util");
const glob = util_1.promisify(Glob);
function getFilesPattern(rootFolder, folderToSearch) {
    return path_1.join(rootFolder, '**', folderToSearch, '*');
}
exports.getFilesPattern = getFilesPattern;
function getFiles(rootFolder, folderToSearch) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield glob(getFilesPattern('', folderToSearch), {
            nodir: true,
            cwd: rootFolder,
        });
        console.log('files', files);
    });
}
getFiles('/home/alex/dev/test/yotodelete/node_modules/test-crawler/dist-server', '/server');
//# sourceMappingURL=test.js.map