import * as express from 'express';
import { getFiles, getPathForUrl } from 'isomor-core';
import { join } from 'path';
import { isNumber, promisify, isFunction } from 'util';
import { exists } from 'fs';

let startupImport: any;

export interface Context {
    req: express.Request;
    res: express.Response;
    fn: any;
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

function getEntrypointPath(file: string, name: string, classname?: string) {
    if (classname) {
        return `/isomor/${getPathForUrl(file)}/${classname}/${name}`;
    }
    return `/isomor/${getPathForUrl(file)}/${name}`;
}

function getEntrypoint(
    app: express.Express,
    file: string,
    fn: any,
    name: string,
    classname?: string,
) {
    const entrypoint = getEntrypointPath(file, name, classname);
    app.use(entrypoint, async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) => {
        try {
            const context: Context = {
                req,
                res,
                fn,
            };
            const args = (req.body && req.body.args) || [];
            const result = await context.fn(...args);
            return res.send(isNumber(result) ? result.toString() : result);
        } catch (error) {
            next(error);
        }
    });
    return entrypoint;
}

// should getInstance be async?
// normally class instantiation should be sync.
function getClassEntrypoints(
    app: express.Express,
    file: string,
    classname: string,
) {
    if (startupImport && startupImport.getInstance) {
        const obj = startupImport.getInstance(classname);
        return Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
            .filter(name => isFunction(obj[name]) && name !== 'constructor')
            .map(name => getEntrypoint(app, file, obj[name], name, classname));
    }
    return;
}

export async function useIsomor(
    app: express.Express,
    distServerFolder: string,
    serverFolder: string,
): Promise<string[]> {
    const files = await getFiles(distServerFolder, serverFolder);
    return (files.map(file => {
        const functions = getFunctions(distServerFolder, file);
        return (Object.keys(functions)
            .filter(name => isFunction(functions[name]))
            .map(name => {
                const isClass = /^\s*class/.test(functions[name].toString());
                return isClass ? getClassEntrypoints(app, file, name)
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
    distServerFolder: string,
    serverFolder: string,
) {
    const files = await getFiles(distServerFolder, serverFolder);
    const paths = {};

    // need to fix swagger

    // files.forEach(file => {
    //     const functions = getFunctions(distServerFolder, file);
    //     return Object.keys(functions).forEach(name => {
    //         paths[getEntrypointPath(file, name)] = {
    //             post: {
    //                 operationId: `${file}-${name}`,
    //                 summary: file,
    //                 tags: [file],
    //                 produces: [
    //                     'application/json',
    //                 ],
    //                 parameters: [
    //                     {
    //                         name: 'args',
    //                         in: 'body',
    //                         description: 'Function arguments',
    //                         required: true,
    //                         schema: {
    //                             $ref: '#/definitions/Args',
    //                         },
    //                     },
    //                 ],
    //                 responses: {
    //                     200: {
    //                         description: '200 response',
    //                         examples: {
    //                             'application/json': '{}',
    //                         },
    //                     },
    //                 },
    //             },
    //         };
    //     });
    // });
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
