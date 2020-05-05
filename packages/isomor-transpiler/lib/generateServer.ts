import { info } from 'logol';
import { outputJson, pathExists } from 'fs-extra';
import { join } from 'path';
import { Options } from 'isomor-core';

import { shell } from './shell';

export async function generateServer({
    serverFolder,
    srcFolder,
    watchMode,
}: Options) {
    info('Transpile server with tsc');
    const tsConfigFile = 'tsconfig.json';
    const tsConfigPath = join(srcFolder, tsConfigFile);
    if (!(await pathExists(tsConfigPath))) {
        const tsconfig = {
            compilerOptions: {
                types: ['node'],
                module: 'commonjs',
                allowJs: true,
                declaration: true,
                removeComments: true,
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                target: 'es6',
                sourceMap: false,
            },
        };
        await outputJson(tsConfigPath, tsconfig);
    }
    const cmd = shell(
        'tsc',
        `--outDir ${serverFolder} -p ${tsConfigFile}${
            watchMode ? ' --watch' : ''
        }`.split(' '),
        srcFolder,
    );
    // if not in watchMode wait for script to finish before to exit
    if (!watchMode) {
        await cmd;
    }
}
