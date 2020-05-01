"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs = require("fs");
const util_1 = require("util");
const fs_extra_1 = require("fs-extra");
const readdir = util_1.promisify(fs.readdir);
var config_1 = require("./config");
exports.getOptions = config_1.getOptions;
function getJsonSchemaFileName(path, name) {
    return `${path}.${name}.json`;
}
exports.getJsonSchemaFileName = getJsonSchemaFileName;
function getFiles(folder, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield fs_extra_1.pathExists(folder))) {
            return [];
        }
        const files = yield readdir(folder, { withFileTypes: true });
        return files
            .filter((f) => f.isFile() && extensions.includes(path_1.extname(f.name)))
            .map((f) => f.name);
    });
}
exports.getFiles = getFiles;
//# sourceMappingURL=index.js.map