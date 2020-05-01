import { join } from 'path';
import { config } from 'dotenv';

export type Extensions = [string, ...string[]];

export interface CommonOptions {
    moduleName: string;
    moduleFolder: string;
    serverFolder: string;
    jsonSchemaFolder: string;
    extensions: Extensions;
}

export interface TranspilerOptions {
    srcFolder: string;
    noValidation: boolean;
    watchMode: boolean;
    skipBuildServer: boolean;
}

export interface ServerOptions {
    port: number;
    staticFolder: string | null;
    startupFile: string;
}

export interface WsOptions {
    wsReg: RegExp | undefined; // RegExp matching the function name to use WebSocket instead of Http
    wsBaseUrl: string;
    wsTimeout: number;
}

export interface HttpOptions {
    httpBaseUrl: string;
}

export type Options = CommonOptions &
    TranspilerOptions &
    ServerOptions &
    WsOptions &
    HttpOptions;

let optionsCache: Options;

const DEFAULT_NAME = 'api';

export function getOptions(): Options {
    if (!optionsCache) {
        config({ path: 'isomor.env' }); // should we find-up?

        const moduleName = process.env.MODULE_NAME || DEFAULT_NAME;
        const moduleFolder = process.env.ISOMOR_MODULE_FOLDER || join(process.cwd(), 'node_modules');

        optionsCache = {
            moduleName,
            moduleFolder,
            serverFolder: process.env.ISOMOR_SERVER_FOLDER || join(moduleFolder, moduleName, 'server'),
            jsonSchemaFolder: process.env.ISOMOR_JSON_SCHEMA_FOLDER || join(moduleFolder, moduleName, 'json-schema'),
            extensions: ['.ts', '.js', ...(process.env.ISOMOR_EXTENSIONS?.split(',') || [])],
            // transpiler
            srcFolder: process.env.ISOMOR_SRC_FOLDER || join(process.cwd(), DEFAULT_NAME),
            noValidation: process.env.ISOMOR_NO_VALIDATION === 'true',
            watchMode: process.env.ISOMOR_WATCH === 'true',
            skipBuildServer: process.env.ISOMOR_SKIP_BUILD_SERVER === 'true',
            // server
            port: process.env.ISOMOR_PORT
                ? parseInt(process.env.ISOMOR_PORT, 10)
                : 3005,
            staticFolder: process.env.ISOMOR_STATIC_FOLDER || null,
            startupFile:
                process.env.ISOMOR_STARTUP_FILE || join('startup', 'index.js'),
            // WsOptions
            wsReg: process.env.ISOMOR_WS
                ? new RegExp(process.env.ISOMOR_WS)
                : undefined,
            wsBaseUrl: process.env.ISOMOR_WS_BASE_URL || 'ws://127.0.0.1:3005',
            wsTimeout: process.env.ISOMOR_WS_TIMEOUT
                ? parseInt(process.env.ISOMOR_WS_TIMEOUT, 10)
                : 60,
            // httpOptions
            httpBaseUrl: process.env.ISOMOR_HTTP_BASE_URL || '',
        };
    }
    return optionsCache;
}
