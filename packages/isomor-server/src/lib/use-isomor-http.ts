import * as express from 'express';
import { Route } from './route';
import { validateArgs } from './utils';

export interface Context {
    req: express.Request;
    res: express.Response;
}

export function useIsomorHttp(
    app: express.Express,
    routes: Route[],
) {
    routes.map(({ path, validationSchema, fn, isClass }) => {
        app.use(path, async (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction,
        ) => {
            try {
                const ctx: Context = { req, res };
                const args = (req.body && req.body.args) || [];
                validateArgs(validationSchema, args);
                const result = isClass
                    ? await fn.call(...args, req, res)
                    : await fn(ctx, ...args);
                return res.send({ result });
            } catch (error) {
                next(error);
            }
        });
    });
}