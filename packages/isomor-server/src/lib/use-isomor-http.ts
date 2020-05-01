import * as express from 'express';
import { Route } from './route';
import { validateArgs } from './utils';
import { BaseContext } from './interface';

export interface HttpContext extends BaseContext {
    type: 'http';
    req: express.Request;
    res: express.Response;
}

export function useIsomorHttp(
    app: express.Express,
    routes: Route[],
) {
    routes.map(({ urlPath, validationSchema, fn }) => {
        app.use(urlPath, async (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction,
        ) => {
            try {
                const ctx: HttpContext = { type: 'http', req, res };
                const args = (req.body && req.body.args) || [];
                validateArgs(validationSchema, args);
                const result = await fn.call(ctx, ...args);
                return res.send({ result });
            } catch (error) {
                next(error);
            }
        });
    });
}
