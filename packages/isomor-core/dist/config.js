"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const dotenv_1 = require("dotenv");
const _1 = require(".");
let optionsCache;
function getOptions() {
    if (!optionsCache) {
        dotenv_1.config({ path: 'isomor.env' });
        const srcFolder = process.env.ISOMOR_SRC_FOLDER || './src-isomor';
        const pkgName = _1.getPkgName(srcFolder);
        optionsCache = {
            pkgName,
            distAppFolder: process.env.ISOMOR_DIST_APP_FOLDER || './src',
            serverFolder: process.env.ISOMOR_SERVER_FOLDER || '/server',
            jsonSchemaFolder: process.env.ISOMOR_JSON_SCHEMA_FOLDER || './json-schema',
            srcFolder,
            noValidation: process.env.ISOMOR_NO_VALIDATION === 'true',
            withTypes: process.env.ISOMOR_NO_TYPES !== 'true',
            watchMode: process.env.ISOMOR_WATCH === 'true',
            noServerImport: process.env.ISOMOR_NO_SERVER_IMPORT === 'true',
            noDecorator: process.env.ISOMOR_NO_DECORATOR === 'true',
            skipCopySrc: process.env.ISOMOR_SKIP_COPY_SRC === 'true',
            distServerFolder: process.env.ISOMOR_DIST_SERVER_FOLDER || './dist-server',
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