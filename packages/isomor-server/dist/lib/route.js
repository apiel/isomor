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
const isomor_core_1 = require("isomor-core");
const isomor_1 = require("isomor");
const path_1 = require("path");
const util_1 = require("util");
const fs_extra_1 = require("fs-extra");
const utils_1 = require("./utils");
function getIsomorRoutes(moduleName, serverFolder, jsonSchemaFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const functions = yield getFunctions(serverFolder);
        return functions.map(({ file, name, fn }) => ({
            fn,
            file,
            urlPath: isomor_1.getUrlPath(moduleName, name),
            validationSchema: loadValidation(jsonSchemaFolder, name),
        }));
    });
}
exports.getIsomorRoutes = getIsomorRoutes;
function getFunctions(serverFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield isomor_core_1.getFiles(serverFolder, ['.js']);
        return files.map((file) => {
            const name = path_1.basename(file, path_1.extname(file));
            const filepath = utils_1.getFullPath(path_1.join(serverFolder, file));
            require = require('esm')(module);
            delete require.cache[filepath];
            const { default: fn } = require(filepath);
            if (!util_1.isFunction(fn)) {
                throw new Error(`No default function found in endpoint ${file}.`);
            }
            return { file, name, fn };
        });
    });
}
function loadValidation(jsonSchemaFolder, name) {
    var _a;
    if ((_a = jsonSchemaFolder) === null || _a === void 0 ? void 0 : _a.length) {
        const jsonSchemaFile = isomor_core_1.getJsonSchemaFileName(name);
        const jsonSchemaPath = path_1.join(jsonSchemaFolder, jsonSchemaFile);
        if (fs_extra_1.pathExistsSync(jsonSchemaPath)) {
            return fs_extra_1.readJSONSync(jsonSchemaPath);
        }
    }
}
//# sourceMappingURL=route.js.map