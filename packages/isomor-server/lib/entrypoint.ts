import * as express from 'express';
import { getPathForUrl } from 'isomor-core';
import { isIsomorClass, getUrl } from 'isomor';
import { join } from 'path';
import { isFunction } from 'util';
import { getInstance } from './startup';

export interface Context {
    req: express.Request;
    res: express.Response;
}

export interface Entrypoint {
    path: string;
    file: string;
}

function getEntrypointPath(file: string, name: string, classname?: string) {
    return getUrl(getPathForUrl(file), name, classname);
}

export function getEntrypoint(
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
export function getClassEntrypoints(
    app: express.Express,
    file: string,
    classname: string,
    noDecorator: boolean,
): Entrypoint[] {
    if (!noDecorator && !isIsomorClass(classname)) {
        return [];
    } else if (getInstance()) {
        const obj = getInstance()(classname);
        return Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
            .filter(name => isFunction(obj[name]) && name !== 'constructor')
            .map(name => getEntrypoint(app, file, obj[name].bind(obj), name, classname));
    }
    return [];
}

export function getFunctions(distServerFolder: string, file: string) {
    const filepath = require.resolve(
        join(distServerFolder, file),
        { paths: [process.cwd()] },
    );
    delete require.cache[filepath];
    const functions = require(filepath);

    return functions;
}
