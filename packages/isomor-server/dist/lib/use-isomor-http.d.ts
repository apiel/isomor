import * as express from 'express';
import { Route } from './route';
export interface Context {
    req: express.Request;
    res: express.Response;
}
export declare function useIsomorHttp(app: express.Express, routes: Route[]): void;
