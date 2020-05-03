import * as express from 'express';
import { join } from 'path';
import { promisify } from 'util';
import { exists } from 'fs';
import { getFullPath } from './utils';
import { Options } from 'isomor-core';

let startupImport: any;

export const getInstance = () => startupImport && startupImport.getInstance;

export async function loadStartupImport(
    { serverFolder, startupFile }: Options,
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
    options: Options,
    info?: (...args: any) => void,
): Promise<void> {
    await loadStartupImport(options, info);
    if (startupImport?.default) {
        startupImport.default(app);
        if (info) {
            info('Startup script executed.');
        }
    }
}
