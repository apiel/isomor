import * as express from 'express';
export interface Context {
    req: express.Request;
    res: express.Response;
}
export interface Entrypoint {
    path: string;
    file: string;
}
export declare function getEntrypoint(app: express.Express, file: string, fn: any, name: string, classname?: string): Entrypoint;
export declare function getClassEntrypoints(app: express.Express, file: string, classname: string, noDecorator: boolean): Entrypoint[];
export declare function getFunctions(distServerFolder: string, file: string): any;
