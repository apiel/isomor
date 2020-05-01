import * as express from 'express';
import { join } from 'path';
import { promisify } from 'util';
import { exists } from 'fs';
import { getFullPath } from './utils';

let startupImport: any;

export const getInstance = () => startupImport && startupImport.getInstance;

export async function loadStartupImport(
    serverFolder: string,
    startupFile: string,
    info?: (...args: any) => void,
) {
    const path = join(serverFolder, startupFile);
    if (await promisify(exists)(path)) {
        const filepath = getFullPath(path);
        startupImport = require(filepath);
        if (info) {
            info('Startup file loaded.');
        }
    }
}

export async function startup(
    app: express.Express,
    serverFolder: string,
    startupFile: string,
    info?: (...args: any) => void,
): Promise<void> {
    await loadStartupImport(serverFolder, startupFile, info);
    if (startupImport?.default) {
        startupImport.default(app);
        if (info) {
            info('Startup script executed.');
        }
    }
}
