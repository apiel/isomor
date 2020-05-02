import { info } from 'logol';
import { emptyDir, copy } from 'fs-extra';
import { Options, getFiles } from 'isomor-core';

import { generateClientJs } from './generateClientJs';
import { generateClientTs } from './generateClientTs';
import { generateServer } from './generateServer';

async function prepare(options: Options) {
    const { jsonSchemaFolder, serverFolder, moduleFolder, srcFolder } = options;

    info('Prepare folders');
    await emptyDir(jsonSchemaFolder);
    await emptyDir(serverFolder);
    await emptyDir(moduleFolder);

    // await copy(srcFolder, moduleFolder);
}

export async function build(options: Options) {
    await prepare(options);

    info('Start transpiling', options.moduleName);

    const { srcFolder, extensions } = options;
    const files = await getFiles(srcFolder, extensions);
    info(`Found ${files.length} file(s).`);

    await generateServer(options);
    await Promise.all(files.map((file) => generateClientJs(options, file)));
    await generateClientTs(options);

    // ToDo fix watcher since it is much more simple now
    // watcher(options);
}
