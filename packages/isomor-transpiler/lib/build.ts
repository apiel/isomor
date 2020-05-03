import { info } from 'logol';
import { emptyDir } from 'fs-extra';
import { Options, getFiles } from 'isomor-core';

import { generateClientJs, clientWatchForJs } from './generateClientJs';
import { generateClientTs, clientWatchForTs } from './generateClientTs';
import { generateServer } from './generateServer';
import { watchForValidation } from './validation';

async function prepare(options: Options) {
    const { serverFolder, moduleFolder } = options;

    info('Prepare folders');
    await emptyDir(serverFolder);
    await emptyDir(moduleFolder);

    // If api folder contain a package.json we might want to copy it
}

export async function build(options: Options) {
    await prepare(options);

    info('Start transpiling', options.moduleName);

    const { watchMode } = options;

    // For the following code, order matter, depending on watch mode or not
    watchForValidation();
    if (watchMode) {
        clientWatchForTs(options);
        clientWatchForJs(options);
        await generateServer(options);
    } else {
        await generateServer(options);
        await generateClientJs(options);
        await generateClientTs(options);
    }
}
