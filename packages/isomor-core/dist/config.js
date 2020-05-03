"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const dotenv_1 = require("dotenv");
let optionsCache;
const DEFAULT_NAME = 'api';
function getOptions() {
    var _a;
    if (!optionsCache) {
        dotenv_1.config({ path: 'isomor.env' });
        const moduleName = process.env.MODULE_NAME || DEFAULT_NAME;
        const moduleFolder = process.env.ISOMOR_MODULE_FOLDER || path_1.join(process.cwd(), 'node_modules', moduleName);
        optionsCache = {
            moduleName,
            moduleFolder,
            serverFolder: process.env.ISOMOR_SERVER_FOLDER || path_1.join(moduleFolder, 'server'),
            extensions: ['.ts', '.js', ...(((_a = process.env.ISOMOR_EXTENSIONS) === null || _a === void 0 ? void 0 : _a.split(',')) || [])],
            srcFolder: process.env.ISOMOR_SRC_FOLDER || path_1.join(process.cwd(), DEFAULT_NAME),
            noValidation: process.env.ISOMOR_NO_VALIDATION === 'true',
            watchMode: process.env.ISOMOR_WATCH === 'true',
            port: process.env.ISOMOR_PORT
                ? parseInt(process.env.ISOMOR_PORT, 10)
                : 3005,
            staticFolder: process.env.ISOMOR_STATIC_FOLDER || null,
            startupFile: process.env.ISOMOR_STARTUP_FILE || path_1.join('startup', 'index.js'),
            wsReg: process.env.ISOMOR_WS
                ? new RegExp(process.env.ISOMOR_WS)
                : undefined,
            wsBaseUrl: process.env.ISOMOR_WS_BASE_URL || 'ws://127.0.0.1:3005',
            wsTimeout: process.env.ISOMOR_WS_TIMEOUT
                ? parseInt(process.env.ISOMOR_WS_TIMEOUT, 10)
                : 60,
            httpBaseUrl: process.env.ISOMOR_HTTP_BASE_URL || '',
        };
    }
    return optionsCache;
}
exports.getOptions = getOptions;
//# sourceMappingURL=config.js.map