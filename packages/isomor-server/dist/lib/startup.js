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
const util_1 = require("util");
const fs_1 = require("fs");
let startupImport;
exports.getInstance = () => startupImport && startupImport.getInstance;
function loadStartupImport(distServerFolder, serverFolder, startupFile, info) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = path_1.join(distServerFolder, serverFolder, startupFile);
        if (yield util_1.promisify(fs_1.exists)(path)) {
            const filepath = require.resolve(path, { paths: [process.cwd()] });
            startupImport = require(filepath);
            if (info) {
                info('Startup file loaded.');
            }
        }
    });
}
exports.loadStartupImport = loadStartupImport;
function startup(app, distServerFolder, serverFolder, startupFile, info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadStartupImport(distServerFolder, serverFolder, startupFile, info);
        if (startupImport && startupImport.default) {
            startupImport.default(app);
            if (info) {
                info('Startup script executed.');
            }
        }
    });
}
exports.startup = startup;
//# sourceMappingURL=startup.js.map