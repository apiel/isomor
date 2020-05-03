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
const generateClientJs_1 = require("./generateClientJs");
const generateClientTs_1 = require("./generateClientTs");
const generateServer_1 = require("./generateServer");
const validation_1 = require("./validation");
function prepare(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { serverFolder, moduleFolder } = options;
        logol_1.info('Prepare folders');
        yield fs_extra_1.emptyDir(serverFolder);
        yield fs_extra_1.emptyDir(moduleFolder);
    });
}
function build(options) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prepare(options);
        logol_1.info('Start transpiling', options.moduleName);
        const { watchMode } = options;
        validation_1.watchForValidation();
        if (watchMode) {
            generateClientTs_1.clientWatchForTs(options);
            generateClientJs_1.clientWatchForJs(options);
            yield generateServer_1.generateServer(options);
        }
        else {
            yield generateServer_1.generateServer(options);
            yield generateClientJs_1.generateClientJs(options);
            yield generateClientTs_1.generateClientTs(options);
        }
    });
}
exports.build = build;
//# sourceMappingURL=build.js.map