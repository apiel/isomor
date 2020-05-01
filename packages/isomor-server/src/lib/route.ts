import { ValidationSchema, getJsonSchemaFileName, getFiles } from 'isomor-core';
import { getUrlPath } from 'isomor';
import { join, extname, basename } from 'path';
import { isFunction } from 'util';
import { pathExistsSync, readJSONSync } from 'fs-extra';

import { getFullPath } from './utils';

export interface Route {
    urlPath: string;
    file: string;
    validationSchema: ValidationSchema;
    fn: any;
}

export async function getIsomorRoutes(
    moduleName: string,
    serverFolder: string,
    jsonSchemaFolder: string,
): Promise<Route[]> {
    const functions = await getFunctions(serverFolder);
    return functions.map(({ file, name, fn }) => ({
        fn,
        file,
        urlPath: getUrlPath(moduleName, name),
        validationSchema: loadValidation(jsonSchemaFolder, name),
    }));
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

function loadValidation( // might want to switch to async
    jsonSchemaFolder: string,
    name: string,
): ValidationSchema {
    if (jsonSchemaFolder?.length) {
        const jsonSchemaFile = getJsonSchemaFileName(name);
        const jsonSchemaPath = join(jsonSchemaFolder, jsonSchemaFile);
        if (pathExistsSync(jsonSchemaPath)) {
            return readJSONSync(jsonSchemaPath);
        }
    }
}
