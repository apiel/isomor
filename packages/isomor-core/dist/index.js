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
function getFiles(folder) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield fs_extra_1.pathExists(folder)) {
            const files = yield fs_extra_1.readdir(folder);
            return Promise.all(files.map((file) => path_1.join(folder, file))
                .filter((filePath) => __awaiter(this, void 0, void 0, function* () {
                const ls = yield fs_extra_1.lstat(filePath);
                return ls.isFile();
            })));
        }
    });
}
exports.getFiles = getFiles;
//# sourceMappingURL=index.js.map