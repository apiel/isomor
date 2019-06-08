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
const isomor_core_1 = require("isomor-core");
const util_1 = require("util");
const entrypoint_1 = require("./entrypoint");
function useIsomor(app, distServerFolder, serverFolder, jsonSchemaFolder, noDecorator = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const pkgName = isomor_core_1.getPkgName(distServerFolder);
        const files = yield isomor_core_1.getFiles(distServerFolder, serverFolder);
        return files.map(file => {
            const functions = entrypoint_1.getFunctions(distServerFolder, file);
            return Object.keys(functions)
                .filter(name => util_1.isFunction(functions[name]))
                .map(name => {
                const isClass = /^\s*class/.test(functions[name].toString());
                return isClass ? entrypoint_1.getClassEntrypoints(app, file, pkgName, name, jsonSchemaFolder, noDecorator)
                    : [entrypoint_1.getEntrypoint(app, file, pkgName, functions[name], name, jsonSchemaFolder)];
            }).flat();
        }).flat();
    });
}
exports.useIsomor = useIsomor;
//# sourceMappingURL=use-isomor.js.map