import * as express from 'express';
import { getPathForUrl, ValidationSchema, getJsonSchemaFileName } from 'isomor-core';
import { isIsomorClass, getUrl } from 'isomor';
import { join } from 'path';
import { isFunction } from 'util';
import { pathExistsSync, readJSONSync } from 'fs-extra';

import { getInstance } from './startup';

export interface Route {
    path: string;
    file: string;
    validationSchema: ValidationSchema;
    fn: any;
}

function getRoutePath(file: string, pkgName: string, name: string, classname?: string) {
    return getUrl(getPathForUrl(file), pkgName, name, classname);
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
    const validationSchema = loadValidation(getPathForUrl(file), name, jsonSchemaFolder, classname);
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
            .filter(name => isFunction(obj[name]) && name !== 'constructor')
            .map(name => getRoute(file, pkgName, obj[name].bind(obj), name, jsonSchemaFolder, classname));
    }
    return [];
}

function getFilePath(distServerFolder: string, file: string) {
    try {
        return require.resolve(
            join(distServerFolder, file),
            { paths: [process.cwd()] },
        );
    } catch (error) {
        return require.resolve(
            join(process.cwd(), distServerFolder, file),
        );
    }
}

export function getFunctions(distServerFolder: string, file: string) {
    const filepath = getFilePath(distServerFolder, file);
    delete require.cache[filepath];
    const functions = require(filepath);

    return functions;
}
