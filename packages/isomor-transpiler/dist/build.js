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
const logol_1 = require("logol");
const fs_extra_1 = require("fs-extra");
const isomor_core_1 = require("isomor-core");
const generateClientJs_1 = require("./generateClientJs");
const generateServer_1 = require("./generateServer");
function prepare(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { jsonSchemaFolder, serverFolder, moduleFolder, srcFolder } = options;
        logol_1.info('Prepare folders');
        yield fs_extra_1.emptyDir(jsonSchemaFolder);
        yield fs_extra_1.emptyDir(serverFolder);
        yield fs_extra_1.emptyDir(moduleFolder);
        yield fs_extra_1.copy(srcFolder, moduleFolder);
    });
}
function build(options) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prepare(options);
        logol_1.info('Start transpiling', options.moduleName);
        const { srcFolder, extensions, skipBuildServer } = options;
        const files = yield isomor_core_1.getFiles(srcFolder, extensions);
        logol_1.info(`Found ${files.length} file(s).`);
        yield Promise.all(files.map((file) => generateClientJs_1.generateClientJs(options, file)));
        if (!skipBuildServer) {
            yield generateServer_1.generateServer(options);
        }
    });
}
exports.build = build;
//# sourceMappingURL=build.js.map