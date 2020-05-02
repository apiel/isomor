import { info } from 'logol';
import { emptyDir } from 'fs-extra';
import { Options, getFiles } from 'isomor-core';

import { generateClientJs } from './generateClientJs';
import { generateClientTs } from './generateClientTs';
import { generateServer } from './generateServer';

async function prepare(options: Options) {
    const { jsonSchemaFolder, serverFolder, moduleFolder } = options;

    info('Prepare folders');
    await emptyDir(jsonSchemaFolder);
    await emptyDir(serverFolder);
    await emptyDir(moduleFolder);

    // If api folder contain a package.json we might want to copy it
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
}
