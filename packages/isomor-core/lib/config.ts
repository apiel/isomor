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

export interface WsOptions {
    wsReg: RegExp | undefined; // RegExp matching the function name to use WebSocket instead of Http
    wsBaseUrl: string;
    wsTimeout: number;
}

export interface HttpOptions {
    httpBaseUrl: string;
}

export type Options = CommonOptions & TranspilerOptions & ServerOptions & WsOptions & HttpOptions;

let optionsCache: Options;

export function getOptions(): Options {
    if (!optionsCache) {
        config({ path: 'isomor.env' }); // should we find-up?

        const srcFolder = process.env.ISOMOR_SRC_FOLDER || './src-isomor';
        const pkgName = getPkgName(srcFolder);

        optionsCache = {
            pkgName,
            distAppFolder: process.env.ISOMOR_DIST_APP_FOLDER || './src',
            serverFolder: process.env.ISOMOR_SERVER_FOLDER || '/server',
            jsonSchemaFolder: process.env.ISOMOR_JSON_SCHEMA_FOLDER || './json-schema',
            // transpiler
            srcFolder,
            noValidation: process.env.ISOMOR_NO_VALIDATION === 'true',
            withTypes: process.env.ISOMOR_NO_TYPES !== 'true',
            watchMode: process.env.ISOMOR_WATCH === 'true',
            noServerImport: process.env.ISOMOR_NO_SERVER_IMPORT === 'true',
            noDecorator: process.env.ISOMOR_NO_DECORATOR === 'true',
            // server
            distServerFolder: process.env.ISOMOR_DIST_SERVER_FOLDER || './dist-server',
            port: process.env.ISOMOR_PORT ? parseInt(process.env.ISOMOR_PORT, 10) : 3005,
            staticFolder: process.env.ISOMOR_STATIC_FOLDER || null,
            startupFile: process.env.ISOMOR_STARTUP_FILE || join('startup', 'index.js'),
            // WsOptions
            wsReg: process.env.ISOMOR_WS ? new RegExp(process.env.ISOMOR_WS) : undefined,
            wsBaseUrl: process.env.ISOMOR_WS_BASE_URL || 'ws://127.0.0.1:3005',
            wsTimeout: process.env.ISOMOR_WS_TIMEOUT ? parseInt(process.env.ISOMOR_WS_TIMEOUT, 10) : 60,
            // httpOptions
            httpBaseUrl: process.env.ISOMOR_HTTP_BASE_URL || '',
        };
    }
    return optionsCache;
}
