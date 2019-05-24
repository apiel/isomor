import * as express from 'express';
import { getFiles, getPathForUrl } from 'isomor-core';
import { isIsomorClass, getUrl } from 'isomor';
import { join } from 'path';
import { isNumber, promisify, isFunction } from 'util';
import { exists } from 'fs';

export interface Context {
    req: express.Request;
    res: express.Response;
}

let startupImport: any;

function getEntrypointPath(file: string, name: string, classname?: string) {
    return getUrl(getPathForUrl(file), name, classname);
}

function getFunctions(distServerFolder: string, file: string) {
    const filepath = require.resolve(
        join(distServerFolder, file),
        { paths: [process.cwd()] },
    );
    delete require.cache[filepath];
    const functions = require(filepath);

    return functions;
}

export interface Entrypoint {
    path: string;
    file: string;
}

function getEntrypoint(
    app: express.Express,
    file: string,
    fn: any,
    name: string,
    classname?: string,
): Entrypoint {
    const path = getEntrypointPath(file, name, classname);
    app.use(path, async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) => {
        try {
            const ctx: Context = {req, res};
            const args = (req.body && req.body.args) || [];
            const result = await fn.call(ctx, ...args, req, res);
            return res.send({ result });
        } catch (error) {
            next(error);
        }
    });
    return { path, file };
}

// should getInstance be async?
// normally class instantiation should be sync.
function getClassEntrypoints(
    app: express.Express,
    file: string,
    classname: string,
    noDecorator: boolean,
): Entrypoint[] {
    if (startupImport && startupImport.getInstance) {
        if (!noDecorator && !isIsomorClass(classname)) {
            return [];
        }
        const obj = startupImport.getInstance(classname);
        return Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
            .filter(name => isFunction(obj[name]) && name !== 'constructor')
            .map(name => getEntrypoint(app, file, obj[name].bind(obj), name, classname));
    }
    return [];
}

export async function useIsomor(
    app: express.Express,
    distServerFolder: string,
    serverFolder: string,
    noDecorator: boolean = false,
): Promise<Entrypoint[]> {
    const files = await getFiles(distServerFolder, serverFolder);
    return (files.map(file => {
        const functions = getFunctions(distServerFolder, file);
        return (Object.keys(functions)
            .filter(name => isFunction(functions[name]))
            .map(name => {
                const isClass = /^\s*class/.test(functions[name].toString());
                return isClass ? getClassEntrypoints(app, file, name, noDecorator)
                    : [getEntrypoint(app, file, functions[name], name)];
            }) as any).flat();
    }) as any).flat();
}

export async function loadStartupImport(
    distServerFolder: string,
    serverFolder: string,
    startupFile: string,
) {
    const path = join(distServerFolder, serverFolder, startupFile);
    if (await promisify(exists)(path)) {
        const filepath = require.resolve(path, { paths: [process.cwd()] });
        startupImport = require(filepath);
    }
}

export async function startup(
    app: express.Express,
    distServerFolder: string,
    serverFolder: string,
    startupFile: string,
): Promise<void> {
    await loadStartupImport(distServerFolder, serverFolder, startupFile);
    if (startupImport && startupImport.default) {
        startupImport.default(app);
    }
}

export async function getSwaggerDoc(
    endpoints: Entrypoint[],
) {
    const paths = {};

    // need to fix swagger

    endpoints.forEach(({ file, path }) => {
        paths[path] = {
            post: {
                operationId: `${file}-${path}`,
                summary: file,
                tags: [file],
                produces: [
                    'application/json',
                ],
                parameters: [
                    {
                        name: 'args',
                        in: 'body',
                        description: 'Function arguments',
                        required: true,
                        schema: {
                            $ref: '#/definitions/Args',
                        },
                    },
                ],
                responses: {
                    200: {
                        description: '200 response',
                        examples: {
                            'application/json': '{}',
                        },
                    },
                },
            },
        };
    });
    return {
        swagger: '2.0',
        info: {
            title: 'isomor',
            version: 'API',
        },
        paths,
        definitions: {
            Args: {
                type: 'object',
                required: [
                    'args',
                ],
                properties: {
                    args: {
                        type: 'array',
                        example: [],
                    },
                },
            },
        },
        consumes: [
            'application/json',
        ],
    };
}
