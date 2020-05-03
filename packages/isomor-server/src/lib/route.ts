import { getFiles, Options } from 'isomor-core';
import { getUrlPath } from 'isomor';
import { join, extname, basename } from 'path';
import { isFunction } from 'util';
import { pathExists, readJSON } from 'fs-extra';

import { getFullPath } from './utils';

export interface Route {
    urlPath: string;
    file: string;
    validationSchema: any; // could be JSONSchema7 from 'json-schema'
    fn: any;
}

export async function getIsomorRoutes(options: Options): Promise<Route[]> {
    const { serverFolder, moduleName } = options;
    const functions = await getFunctions(serverFolder);
    return Promise.all(
        functions.map(async ({ file, name, fn }) => ({
            fn,
            file,
            urlPath: getUrlPath(moduleName, name),
            validationSchema: await loadValidation(options, name),
        })),
    );
}
interface FunctionName {
    file: string;
    name: string;
    fn: () => any;
}
async function getFunctions(serverFolder: string): Promise<FunctionName[]> {
    const files = await getFiles(serverFolder, ['.js']);

    return files.map((file) => {
        const name = basename(file, extname(file));

        const filepath = getFullPath(join(serverFolder, file));
        // use ESM to force ES6 compatibility with nodejs
        require = require('esm')(module /*, options*/);
        delete require.cache[filepath];
        const { default: fn } = require(filepath);

        if (!isFunction(fn)) {
            // if no default fn should create a fallback function with error
            throw new Error(`No default function found in endpoint ${file}.`);
        }

        return { file, name, fn };
    });
}

async function loadValidation(
    { noValidation, serverFolder }: Options,
    name: string,
): Promise<any> {
    // might want to switch to async
    if (!noValidation) {
        const jsonSchemaPath = join(serverFolder, `${name}.ts.json`);
        if (await pathExists(jsonSchemaPath)) {
            return readJSON(jsonSchemaPath);
        }
    }
}
