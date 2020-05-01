import { info } from 'logol';
import { emptyDir, outputJson, pathExists, copy } from 'fs-extra';
import { join } from 'path';
import { Options, getFiles } from 'isomor-core';

import { shell } from './shell';
import { generateJs } from './generateJs';
import { generateTs } from './generateTs';

async function prepare(options: Options) {
    const { jsonSchemaFolder, serverFolder, moduleFolder, srcFolder } = options;

    info('Prepare folders');
    await emptyDir(jsonSchemaFolder);
    await emptyDir(serverFolder);
    await emptyDir(moduleFolder);

    await copy(srcFolder, moduleFolder);
}

async function runTsc({ serverFolder, srcFolder }: Options) {
    info('Transpile server');
    const tsConfigFile = join(srcFolder, 'tsconfig.json');
    if (!(await pathExists(tsConfigFile))) {
        const tsconfig = {
            compilerOptions: {
                types: ['node'],
                module: 'commonjs',
                declaration: false,
                removeComments: true,
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                target: 'es6',
                sourceMap: false,
            },
        };
        await outputJson(tsConfigFile, tsconfig);
    }
    return shell(
        'tsc',
        `--outDir ${serverFolder} -p tsconfig.json`.split(' '),
        srcFolder,
    );
}

export async function build(options: Options) {
    await prepare(options);

    info('Start transpiling', options.moduleName);

    const { srcFolder, extensions, skipBuildServer } = options;
    const files = await getFiles(srcFolder, extensions);
    info(`Found ${files.length} file(s).`);

    await Promise.all(files.map((file) => transpile(options, file)));
    if (!skipBuildServer) {
        await runTsc(options);
    }
    // ToDo fix watcher since it is much more simple now
    // watcher(options);
}

async function transpile(options: Options, file: string) {
    // await generateTs(options, file);
    await generateJs(options, file);
}