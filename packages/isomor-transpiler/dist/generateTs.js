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
const logol_1 = require("logol");
const debug_1 = require("debug");
const fs_extra_1 = require("fs-extra");
const ast_1 = require("./ast");
const transform_1 = require("./transform");
function generateTs(options, file) {
    return __awaiter(this, void 0, void 0, function* () {
        const { moduleFolder, srcFolder } = options;
        logol_1.info('Transpile', file);
        const srcFilePath = path_1.join(srcFolder, file);
        const buffer = yield fs_extra_1.readFile(srcFilePath);
        debug_1.default('isomor-transpiler:transpile:in')(buffer.toString());
        const moduleTsFile = path_1.join(moduleFolder, file);
        const codeTs = getCode(options, srcFilePath, buffer.toString(), true);
        logol_1.info('Save isomor TS file', moduleTsFile);
        yield fs_extra_1.outputFile(moduleTsFile, codeTs);
        debug_1.default('isomor-transpiler:transpile:out')(codeTs);
    });
}
exports.generateTs = generateTs;
function getCode(options, srcFilePath, content, declaration) {
    const { wsReg, wsBaseUrl, httpBaseUrl, moduleName } = options;
    const { program } = ast_1.parse(content);
    const fnOptions = {
        srcFilePath,
        wsReg,
        moduleName,
        wsBaseUrl,
        httpBaseUrl,
        declaration,
    };
    program.body = transform_1.default(program.body, fnOptions);
    const { code } = ast_1.generate(program);
    return code;
}
//# sourceMappingURL=generateTs.js.map