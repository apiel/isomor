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
const startup_1 = require("./startup");
const utils_1 = require("./utils");
function getIsomorRoutes(serverFolder, distServerFolder, jsonSchemaFolder, noDecorator) {
    return __awaiter(this, void 0, void 0, function* () {
        const pkgName = isomor_core_1.getPkgName(distServerFolder);
        const fnNames = yield getFunctionNames(serverFolder, distServerFolder);
        const routes = fnNames.map(({ file, isClass, name, fn }) => isClass
            ? getClassRoutes(file, pkgName, name, jsonSchemaFolder, noDecorator)
            : [getRoute(file, pkgName, fn, name, jsonSchemaFolder)]);
        return routes.flat();
    });
}
exports.getIsomorRoutes = getIsomorRoutes;
function getFunctionNames(serverFolder, distServerFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield isomor_core_1.getFiles(distServerFolder, serverFolder);
        return files.map(file => {
            const functions = getFunctions(distServerFolder, file);
            return Object.keys(functions)
                .filter(name => util_1.isFunction(functions[name]))
                .map(name => {
                const isClass = /^\s*class/.test(functions[name].toString());
                return { file, isClass, name, fn: functions[name] };
            }).flat();
        }).flat();
    });
}
function getRoutePath(file, pkgName, name, classname) {
    return isomor_1.getUrl(isomor_core_1.getPathForUrl(file), pkgName, name, classname);
}
function loadValidation(path, name, jsonSchemaFolder, classname) {
    if (jsonSchemaFolder && jsonSchemaFolder.length) {
        const jsonSchemaFile = isomor_core_1.getJsonSchemaFileName(path, name, classname);
        const jsonSchemaPath = path_1.join(jsonSchemaFolder, jsonSchemaFile);
        if (fs_extra_1.pathExistsSync(jsonSchemaPath)) {
            return fs_extra_1.readJSONSync(jsonSchemaPath);
        }
    }
}
function getRoute(file, pkgName, fn, name, jsonSchemaFolder, classname) {
    const path = getRoutePath(file, pkgName, name, classname);
    const validationSchema = loadValidation(isomor_core_1.getPathForUrl(file), name, jsonSchemaFolder, classname);
    return { path, file, validationSchema, fn, isClass: !!classname };
}
exports.getRoute = getRoute;
function getClassRoutes(file, pkgName, classname, jsonSchemaFolder, noDecorator) {
    if (!noDecorator && !isomor_1.isIsomorClass(classname)) {
        return [];
    }
    else if (startup_1.getInstance()) {
        const obj = startup_1.getInstance()(classname);
        return Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
            .filter(name => util_1.isFunction(obj[name]) && name !== 'constructor')
            .map(name => getRoute(file, pkgName, obj[name].bind(obj), name, jsonSchemaFolder, classname));
    }
    return [];
}
exports.getClassRoutes = getClassRoutes;
function getFunctions(distServerFolder, file) {
    const filepath = utils_1.getFullPath(path_1.join(distServerFolder, file));
    delete require.cache[filepath];
    const functions = require(filepath);
    return functions;
}
exports.getFunctions = getFunctions;
//# sourceMappingURL=route.js.map