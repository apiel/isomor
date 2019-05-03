import * as express from 'express';
import { getFiles, getPathForUrl } from 'isomor-core';
import { join } from 'path';

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

function getEntrypoint(file: string, name: string) {
    return `/isomor/${getPathForUrl(file)}/${name}`;
}

export async function useIsomor(
    app: express.Express,
    distServerFolder: string,
    serverFolder: string,
): Promise<string[]> {
    const files = await getFiles(distServerFolder, serverFolder);
    return (files.map(file => {
        const functions = getFunctions(distServerFolder, file);
        return Object.keys(functions).map(name => {
            const entrypoint = getEntrypoint(file, name);
            app.use(entrypoint, async (
                req: express.Request,
                res: express.Response,
                next: express.NextFunction,
            ) => {
                try {
                    const context: Context = {
                        req,
                        res,
                        fn: functions[name],
                    };
                    const args = (req.body && req.body.args) || [];
                    const result = await context.fn(...args);
                    return res.send(result);
                } catch (error) {
                    next(error);
                }
            });
            return entrypoint;
        });
    }) as any).flat();
}

export async function getSwaggerDoc(
    distServerFolder: string,
    serverFolder: string,
) {
    const files = await getFiles(distServerFolder, serverFolder);
    const paths = {};
    files.forEach(file => {
        const functions = getFunctions(distServerFolder, file);
        return Object.keys(functions).forEach(name => {
            paths[getEntrypoint(file, name)] = {
                post: {
                    operationId: file,
                    summary: file,
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
