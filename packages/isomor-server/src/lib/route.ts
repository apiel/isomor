import {
    ValidationSchema,
    getJsonSchemaFileName,
    getFiles,
} from 'isomor-core';
import { isIsomorClass, getUrlPath } from 'isomor';
import { join, extname, basename } from 'path';
import { isFunction } from 'util';
import { pathExistsSync, readJSONSync } from 'fs-extra';

import { getInstance } from './startup';
import { getFullPath } from './utils';

export interface Route {
    path: string;
    file: string;
    validationSchema: ValidationSchema;
    fn: any;
}

export async function getIsomorRoutes(
    moduleName: string,
    serverFolder: string,
    jsonSchemaFolder: string,
): Promise<Route[]> {
    const fnNames = await getFunctionNames(serverFolder);
    const routes = fnNames.map(({ file, name, fn }) => [
        getRoute(file, moduleName, fn, name, jsonSchemaFolder),
    ]);
    return routes.flat();
}

interface FunctionName {
    file: string;
    name: string;
    fn: () => any;
}
async function getFunctionNames(
    serverFolder: string,
): Promise<FunctionName[]> {
    const files = await getFiles(serverFolder, ['.js']);

    return files.map((file) => {
        const name = basename(file, extname(file));

        const filepath = getFullPath(join(serverFolder, file));
        // use ESM to force ES6 compatibility with nodejs
        require = require('esm')(module /*, options*/);
        delete require.cache[filepath];
        const { default: fn } = require(filepath);
        // console.log('fn', file, fn);
        // if no default fn should create a fallback function with error

        return { file, name, fn };
    });
}

function getRoutePath(
    file: string,
    pkgName: string,
    name: string,
    classname?: string,
) {
    return getUrlPath('', pkgName, name, classname);
}

function loadValidation( // might want to switch to async
    path: string,
    name: string,
    jsonSchemaFolder: string,
    classname?: string,
): ValidationSchema {
    if (jsonSchemaFolder && jsonSchemaFolder.length) {
        const jsonSchemaFile = getJsonSchemaFileName(path, name);
        const jsonSchemaPath = join(jsonSchemaFolder, jsonSchemaFile);
        if (pathExistsSync(jsonSchemaPath)) {
            return readJSONSync(jsonSchemaPath);
        }
    }
}

export function getRoute(
    file: string,
    pkgName: string,
    fn: any,
    name: string,
    jsonSchemaFolder: string,
    classname?: string,
): Route {
    const path = getRoutePath(file, pkgName, name, classname);
    const validationSchema = loadValidation(
        '',
        name,
        jsonSchemaFolder,
        classname,
    );
    return { path, file, validationSchema, fn };
}
