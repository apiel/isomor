import { Options } from 'isomor-core';
import { join } from 'path';
import { info } from 'logol';
import debug from 'debug';
import { outputFile, readFile } from 'fs-extra';

import { parse, generate } from './__deprecated/ast';
import transform from './__deprecated/transform';
import { FnOptions } from './__deprecated/transformNode';

// instead to transpile with babel, we could use original TS files
// previously copied during initialization
// so the typescript file will be use for type definition
// but seem to be an issue with some framework, e.g. React seem to build
//
// To build final package, we could also run tsc with --emitDeclarationOnly
// but tsc is very slow

export async function generateTs(options: Options, file: string) {
    const { moduleFolder, srcFolder } = options;

    info('Transpile', file);
    const srcFilePath = join(srcFolder, file);
    const buffer = await readFile(srcFilePath);
    debug('isomor-transpiler:transpile:in')(buffer.toString());

    // ToDo generate TS file only if TS
    const moduleTsFile = join(moduleFolder, file);
    const codeTs = getCode(options, srcFilePath, buffer.toString(), true);

    info('Save isomor TS file', moduleTsFile);
    await outputFile(moduleTsFile, codeTs);
    debug('isomor-transpiler:transpile:out')(codeTs);
}

function getCode(
    options: Options,
    srcFilePath: string,
    content: string,
    declaration: boolean,
) {
    const { wsReg, wsBaseUrl, httpBaseUrl, moduleName } = options;
    const { program } = parse(content);

    const fnOptions: FnOptions = {
        srcFilePath,
        wsReg,
        moduleName,
        wsBaseUrl,
        httpBaseUrl,
        declaration,
    };

    program.body = transform(program.body, fnOptions);
    const { code } = generate(program as any);

    return code;
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
