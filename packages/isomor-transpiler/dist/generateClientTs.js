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
const fs_extra_1 = require("fs-extra");
const glob = require("glob");
const util_1 = require("util");
const chokidar_1 = require("chokidar");
const event_1 = require("./event");
const globAsync = util_1.promisify(glob);
function generateClientTs(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { serverFolder } = options;
        const dtsFiles = yield globAsync('**/*.d.ts', { cwd: serverFolder });
        logol_1.info(`Copy d.ts files to module`, dtsFiles);
        yield Promise.all(dtsFiles.map(copyDTs(options)));
    });
}
exports.generateClientTs = generateClientTs;
function clientWatchForTs(options) {
    const { serverFolder } = options;
    chokidar_1.watch('.', {
        cwd: serverFolder,
        usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
    })
        .on('ready', () => logol_1.info('Watch for d.ts files...'))
        .on('add', copyDTs(options, logol_1.info))
        .on('change', copyDTs(options, logol_1.info));
}
exports.clientWatchForTs = clientWatchForTs;
const copyDTs = ({ serverFolder, moduleFolder }, log = (...args) => void 0) => (file) => {
    if (file.endsWith('.d.ts')) {
        event_1.updateDTsFile(path_1.join(serverFolder, file));
        log(`Copy ${file} to module.`);
        return fs_extra_1.copy(path_1.join(serverFolder, file), path_1.join(moduleFolder, file));
    }
};
//# sourceMappingURL=generateClientTs.js.map