import * as express from 'express';
import { getPathForUrl, ValidationSchema, getJsonSchemaFileName } from 'isomor-core';
import { isIsomorClass, getUrl } from 'isomor';
import { join } from 'path';
import { isFunction } from 'util';
import { pathExistsSync, readJSONSync } from 'fs-extra';
import * as Ajv from 'ajv';

import { getInstance } from './startup';

export interface Context {
    req: express.Request;
    res: express.Response;
}

export interface Entrypoint {
    path: string;
    file: string;
    validationSchema: ValidationSchema;
}

function getEntrypointPath(file: string, pkgName: string, name: string, classname?: string) {
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

function validateArgs(
    validationSchema: ValidationSchema,
    args: any[],
) {
    if (validationSchema) {
        const ajv = new Ajv();
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        const valid = ajv.validate(validationSchema.schema, args);
        if (!valid) {
            throw(new Error(`Invalid argument format: ${ajv.errorsText()}.`));
        }
    }
}

export function getEntrypoint(
    app: express.Express,
    file: string,
    pkgName: string,
    fn: any,
    name: string,
    jsonSchemaFolder: string,
    classname?: string,
): Entrypoint {
    const path = getEntrypointPath(file, pkgName, name, classname);
    const validationSchema = loadValidation(getPathForUrl(file), name, jsonSchemaFolder, classname);
    app.use(path, async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) => {
        try {
            const ctx: Context = {req, res};
            const args = (req.body && req.body.args) || [];
            validateArgs(validationSchema, args);
            const result = await fn.call(ctx, ...args, req, res);
            return res.send({ result });
        } catch (error) {
            next(error);
        }
    });
    return { path, file, validationSchema };
}

// should getInstance be async?
// normally class instantiation should be sync.
export function getClassEntrypoints(
    app: express.Express,
    file: string,
    pkgName: string,
    classname: string,
    jsonSchemaFolder: string,
    noDecorator: boolean,
): Entrypoint[] {
    if (!noDecorator && !isIsomorClass(classname)) {
        return [];
    } else if (getInstance()) {
        const obj = getInstance()(classname);
        return Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
            .filter(name => isFunction(obj[name]) && name !== 'constructor')
            .map(name => getEntrypoint(app, file, pkgName, obj[name].bind(obj), name, jsonSchemaFolder, classname));
    }
    return [];
}

export function getFunctions(distServerFolder: string, file: string) {
    const filepath = require.resolve(
        // join(process.cwd(), distServerFolder, file),
        join(distServerFolder, file),
        { paths: [process.cwd()] },
    );
    delete require.cache[filepath];
    const functions = require(filepath);

    return functions;
}
