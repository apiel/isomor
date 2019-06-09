"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const dotenv_1 = require("dotenv");
const _1 = require(".");
let optionsCache;
function getOptions() {
    if (!optionsCache) {
        dotenv_1.config({ path: 'isomor.env' });
        const srcFolder = process.env.SRC_FOLDER || './src-isomor';
        const pkgName = _1.getPkgName(srcFolder);
        optionsCache = {
            pkgName,
            distAppFolder: process.env.DIST_APP_FOLDER || './src',
            serverFolder: process.env.SERVER_FOLDER || '/server',
            jsonSchemaFolder: process.env.JSON_SCHEMA_FOLDER || './json-schema',
            srcFolder,
            noValidation: process.env.NO_VALIDATION === 'true',
            withTypes: process.env.NO_TYPES !== 'true',
            watchMode: process.env.WATCH === 'true',
            noServerImport: process.env.NO_SERVER_IMPORT === 'true',
            noDecorator: process.env.NO_DECORATOR === 'true',
            distServerFolder: process.env.DIST_SERVER_FOLDER || './dist-server',
            port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3005,
            staticFolder: process.env.STATIC_FOLDER || null,
            startupFile: process.env.STARTUP_FILE || path_1.join('startup', 'index.js'),
        };
    }
    return optionsCache;
}
exports.getOptions = getOptions;
//# sourceMappingURL=config.js.map