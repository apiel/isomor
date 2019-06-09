import { join } from 'path';
import { config } from 'dotenv';
import { getPkgName } from '.';

export interface CommonOptions {
    pkgName: string;
    distAppFolder: string;
    serverFolder: string;
    jsonSchemaFolder: string;
}

export interface TranspilerOptions {
    srcFolder: string;
    noValidation: boolean;
    withTypes: boolean;
    watchMode: boolean;
    noServerImport: boolean;
    noDecorator: boolean;
}

export interface ServerOptions {
    port: number;
    staticFolder: string | null;
    startupFile: string;
    distServerFolder: string;
}

export type Options = CommonOptions & TranspilerOptions & ServerOptions;

let optionsCache: Options;

export function getOptions(): Options {
    if (!optionsCache) {
        config({ path: 'isomor.env' }); // should we find-up?

        const srcFolder = process.env.SRC_FOLDER || './src-isomor';
        const pkgName = getPkgName(srcFolder);

        optionsCache = {
            pkgName,
            distAppFolder: process.env.DIST_APP_FOLDER || './src',
            serverFolder: process.env.SERVER_FOLDER || '/server',
            jsonSchemaFolder: process.env.JSON_SCHEMA_FOLDER || './json-schema',
            // transpiler
            srcFolder,
            noValidation: process.env.NO_VALIDATION === 'true',
            withTypes: process.env.NO_TYPES !== 'true',
            watchMode: process.env.WATCH === 'true',
            noServerImport: process.env.NO_SERVER_IMPORT === 'true',
            noDecorator: process.env.NO_DECORATOR === 'true',
            // server
            distServerFolder: process.env.DIST_SERVER_FOLDER || './dist-server',
            port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3005,
            staticFolder: process.env.STATIC_FOLDER || null,
            startupFile: process.env.STARTUP_FILE || join('startup', 'index.js'),
        };
    }
    return optionsCache;
}
