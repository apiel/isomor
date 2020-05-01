import * as express from 'express';
import { Route } from './route';
import { BaseContext } from './interface';
export interface HttpContext extends BaseContext {
    type: 'http';
    req: express.Request;
    res: express.Response;
}
export declare function useIsomorHttp(app: express.Express, routes: Route[]): void;
