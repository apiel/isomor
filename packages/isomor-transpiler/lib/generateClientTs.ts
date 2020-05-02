import { Options } from 'isomor-core';
import { join } from 'path';
import { info } from 'logol';
import { outputJson, pathExists } from 'fs-extra';
import * as glob from 'glob';
import { promisify } from 'util';

import { shell } from './shell';

const globAsync = promisify(glob);

export async function generateClientTs(options: Options) {
    const { srcFolder } = options;
    // here we have to skip d.ts
    const tsFiles = await globAsync('**/*.ts', { cwd: srcFolder });
    // console.log('tsFiles', tsFiles);

    if (tsFiles.length) {
        await generateDeclarationWithTsc(options);

        // After generating the d.ts file, we can remove all the ts file from the package
        // await Promise.all(tsFiles.map(file => unlink(join(moduleFolder, file))));
    }
}

// instead to run this tsc twice, we could just use declaration from previously generated server
async function generateDeclarationWithTsc({
    moduleFolder,
    srcFolder,
}: Options) {
    info('Generate client d.ts file with tsc');
    const tsConfigFile = 'tsconfig.d.json';
    const tsConfigPath = join(srcFolder, tsConfigFile);
    if (!(await pathExists(tsConfigPath))) {
        // should use a common ts config
        const tsconfig = {
            compilerOptions: {
                types: ['node'],
                module: 'commonjs',
                declaration: true,
                // removeComments: true,
                // emitDecoratorMetadata: true,
                experimentalDecorators: true,
                emitDeclarationOnly: true,
                target: 'es6',
                // sourceMap: false,
            },
        };
        await outputJson(tsConfigPath, tsconfig);
    }
    return shell(
        'tsc',
        `--outDir ${moduleFolder} -p ${tsConfigFile}`.split(' '),
        srcFolder,
    );
}

// {
//     "compilerOptions": {
//         "types": ["node"],
//         "module": "commonjs",
//         // "declaration": false,
//         "declaration": true,
//         "emitDeclarationOnly": true,
//         "removeComments": true,
//         "emitDecoratorMetadata": true,
//         "experimentalDecorators": true,
//         "target": "es6",
//         "sourceMap": false
//     }
// }
