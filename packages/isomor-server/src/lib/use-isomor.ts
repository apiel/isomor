import * as express from 'express';
import { getFiles, getPkgName, ValidationSchema } from 'isomor-core';
import { isFunction } from 'util';
import * as Ajv from 'ajv';
import { Route, getFunctions, getClassRoutes, getRoute } from './route';

export async function useIsomor(
    app: express.Express,
    distServerFolder: string,
    serverFolder: string,
    jsonSchemaFolder: string,
    noDecorator: boolean = false,
): Promise<Route[]> {
    const pkgName = getPkgName(distServerFolder);
    const files = await getFiles(distServerFolder, serverFolder);
    const routes = getRoutes(files, pkgName, distServerFolder, jsonSchemaFolder, noDecorator);
    mountRoutesHttp(app, routes);

    return routes;
}

export interface Context {
    req: express.Request;
    res: express.Response;
}

function mountRoutesHttp(
    app: express.Express,
    routes: Route[],
) {
    routes.map(({ path, validationSchema, fn }) => {
        app.use(path, async (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction,
        ) => {
            try {
                const ctx: Context = { req, res };
                const args = (req.body && req.body.args) || [];
                validateArgs(validationSchema, args);
                const result = await fn.call(ctx, ...args, req, res);
                return res.send({ result });
            } catch (error) {
                next(error);
            }
        });
    });
}

function getRoutes(
    files: string[],
    pkgName: string,
    distServerFolder: string,
    jsonSchemaFolder: string,
    noDecorator: boolean,
): Route[] {
    return (files.map(file => {
        const functions = getFunctions(distServerFolder, file);
        return (Object.keys(functions)
            .filter(name => isFunction(functions[name]))
            .map(name => {
                const isClass = /^\s*class/.test(functions[name].toString());
                return isClass
                    ? getClassRoutes(file, pkgName, name, jsonSchemaFolder, noDecorator)
                    : [getRoute(file, pkgName, functions[name], name, jsonSchemaFolder)];
            }) as any).flat();
    }) as any).flat();
}

export function validateArgs(
    validationSchema: ValidationSchema,
    args: any[],
) {
    if (validationSchema) {
        const ajv = new Ajv();
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        const valid = ajv.validate(validationSchema.schema, args);
        if (!valid) {
            throw (new Error(`Invalid argument format: ${ajv.errorsText()}.`));
        }
    }
}
