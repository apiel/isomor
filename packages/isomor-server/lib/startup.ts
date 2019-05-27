import * as express from 'express';
import { join } from 'path';
import { promisify } from 'util';
import { exists } from 'fs';

let startupImport: any;

export const getInstance = () => startupImport && startupImport.getInstance;

export async function loadStartupImport(
    distServerFolder: string,
    serverFolder: string,
    startupFile: string,
    info?: (...args: any) => void,
) {
    const path = join(distServerFolder, serverFolder, startupFile);
    if (await promisify(exists)(path)) {
        const filepath = require.resolve(path, { paths: [process.cwd()] });
        startupImport = require(filepath);
        if (info) {
            info('Startup file loaded.');
        }
    }
}

export async function startup(
    app: express.Express,
    distServerFolder: string,
    serverFolder: string,
    startupFile: string,
    info?: (...args: any) => void,
): Promise<void> {
    await loadStartupImport(distServerFolder, serverFolder, startupFile, info);
    if (startupImport && startupImport.default) {
        startupImport.default(app);
        if (info) {
            info('Startup script executed.');
        }
    }
}
