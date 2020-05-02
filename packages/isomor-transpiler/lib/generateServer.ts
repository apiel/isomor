import { info } from 'logol';
import { outputJson, pathExists } from 'fs-extra';
import { join } from 'path';
import { Options } from 'isomor-core';

import { shell } from './shell';

// dev mode we should use babel

export async function generateServer(options: Options) {
    await generateServerWithTsc(options);
    // await generateServerWithBabel(options);
}

export async function generateServerWithBabel({
    serverFolder,
    srcFolder,
}: Options) {
    info('Transpile server with babel');
    const balelFile = '.babelrc.json';
    const babelPath = join(srcFolder, balelFile);
    if (!(await pathExists(babelPath))) {
        const babelConfig = {
            presets: ['@babel/preset-typescript', '@babel/preset-env'],
        };
        await outputJson(babelPath, babelConfig);
    }
    // console.log('yyo', `${srcFolder} --outDir ${serverFolder} --extensions ".ts" --config-file ${babelPath}`);
    return shell(
        'babel',
        `${srcFolder} --outDir ${serverFolder} --extensions ".ts" --config-file ${babelPath}`.split(' '),
    );
}

export async function generateServerWithTsc({
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
        `--outDir ${serverFolder} -p ${tsConfigFile}${watchMode ? ' --watch' : ''}`.split(' '),
        srcFolder,
    );
    // if not in watchMode wait for script to finish before to exit
    if (!watchMode) {
        await cmd;
    }
}
