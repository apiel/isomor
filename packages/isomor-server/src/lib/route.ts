import {
    getPathForUrl,
    ValidationSchema,
    getJsonSchemaFileName,
    getPkgName,
    // getFiles,
} from 'isomor-core';
import { isIsomorClass, getUrlPath } from 'isomor';
import { join, extname, basename } from 'path';
import { isFunction } from 'util';
import { pathExistsSync, readJSONSync } from 'fs-extra';
import { promises as fs } from 'fs';

import { getInstance } from './startup';
import { getFullPath } from './utils';

export interface Route {
    path: string;
    file: string;
    validationSchema: ValidationSchema;
    fn: any;
}

export async function getIsomorRoutes(
    serverFolder: string,
    distServerFolder: string,
    jsonSchemaFolder: string,
    noDecorator: boolean,
): Promise<Route[]> {
    const pkgName = 'api';

    // const pkgName = getPkgName(distServerFolder);
    const fnNames = await getFunctionNames(serverFolder, distServerFolder);
    const routes = fnNames.map(({ file, name, fn }) => [
        getRoute(file, pkgName, fn, name, jsonSchemaFolder),
    ]);
    return routes.flat();
}

// custom getFiles to be part of core
// ToDo get extensions from configs
async function getFiles(folder: string, extensions = ['.js']) {
    const files = await fs.readdir(folder, { withFileTypes: true });
    return files
        .filter((f) => f.isFile() && extensions.includes(extname(f.name)))
        .map((f) => f.name);
}

interface FunctionName {
    file: string;
    name: string;
    fn: () => any;
}
async function getFunctionNames(
    serverFolder: string,
    distServerFolder: string,
): Promise<FunctionName[]> {
    // const files = await getFiles(distServerFolder, serverFolder);
    const theFolder = '/home/alex/dev/node/pkg/isomor/packages/example/react/node_modules/api/server';
    const files = await getFiles(theFolder);

    return files.map((file) => {
        const name = basename(file, extname(file));

        const filepath = getFullPath(join(theFolder, file));
        // use ESM to force ES6 compatibility with nodejs
        require = require('esm')(module /*, options*/);
        delete require.cache[filepath];
        const { default: fn } = require(filepath);
        // console.log('fn', file, fn);
        // if no default fn should create a fallback function with error

        return { file, name, fn };
    });

    // return files
    //     .map((file) => {
    //         const functions = getFunctions(distServerFolder, file);
    //         return Object.keys(functions)
    //             .filter((name) => isFunction(functions[name]))
    //             .map((name) => {
    //                 const isClass = /^\s*class/.test(
    //                     functions[name].toString(),
    //                 );
    //                 return { file, isClass, name, fn: functions[name] };
    //             })
    //             .flat();
    //     })
    //     .flat();
}

function getRoutePath(
    file: string,
    pkgName: string,
    name: string,
    classname?: string,
) {
    return getUrlPath(getPathForUrl(file), pkgName, name, classname);
}

function loadValidation( // might want to switch to async
    path: string,
    name: string,
    jsonSchemaFolder: string,
    classname?: string,
): ValidationSchema {
    if (jsonSchemaFolder && jsonSchemaFolder.length) {
        const jsonSchemaFile = getJsonSchemaFileName(path, name, classname);
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
        getPathForUrl(file),
        name,
        jsonSchemaFolder,
        classname,
    );
    return { path, file, validationSchema, fn };
}

// should getInstance be async?
// normally class instantiation should be sync.
export function getClassRoutes(
    file: string,
    pkgName: string,
    classname: string,
    jsonSchemaFolder: string,
    noDecorator: boolean,
): Route[] {
    if (!noDecorator && !isIsomorClass(classname)) {
        return [];
    } else if (getInstance()) {
        const obj = getInstance()(classname);
        return Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
            .filter((name) => isFunction(obj[name]) && name !== 'constructor')
            .map((name) =>
                getRoute(
                    file,
                    pkgName,
                    obj[name].bind(obj),
                    name,
                    jsonSchemaFolder,
                    classname,
                ),
            );
    }
    return [];
}

export function getFunctions(distServerFolder: string, file: string) {
    const filepath = getFullPath(join(distServerFolder, file));
    // use ESM to force ES6 compatibility with nodejs
    require = require('esm')(module /*, options*/);
    delete require.cache[filepath];
    const functions = require(filepath);

    return functions;
}
