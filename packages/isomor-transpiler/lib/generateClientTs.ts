import { Options } from 'isomor-core';
import { join } from 'path';
import { info } from 'logol';
import { copy } from 'fs-extra';
import * as glob from 'glob';
import { promisify } from 'util';
import { watch } from 'chokidar';

const globAsync = promisify(glob);

export async function generateClientTs(options: Options) {
    const { serverFolder } = options;

    const dtsFiles = await globAsync('**/*.d.ts', { cwd: serverFolder });
    info(`Copy d.ts files to module`, dtsFiles);
    await Promise.all(dtsFiles.map(copyDTs(options)));
}

export function clientWatchForTs(options: Options) {
    const { serverFolder } = options;
    // watch('**/*.d.ts', { // glob seem to have issues with chokidar https://github.com/paulmillr/chokidar/issues/872
    watch('.', {
        cwd: serverFolder,
        usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
    })
        .on('ready', () => info('Watch for d.ts files...'))
        .on('add', copyDTs(options, info))
        .on('change', copyDTs(options, info));
}

const copyDTs = (
    { serverFolder, moduleFolder }: Options,
    log = (...args: any[]) => void 0,
) => (file: string) => {
    if (file.endsWith('.d.ts')) {
        log(`Copy ${file} to module.`);
        return copy(join(serverFolder, file), join(moduleFolder, file));
    }
};
