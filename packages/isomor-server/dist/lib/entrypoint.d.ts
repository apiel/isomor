import * as express from 'express';
import { ValidationSchema } from 'isomor-core';
export interface Context {
    req: express.Request;
    res: express.Response;
}
export interface Entrypoint {
    path: string;
    file: string;
    validationSchema: ValidationSchema;
}
export declare function getEntrypoint(app: express.Express, file: string, pkgName: string, fn: any, name: string, jsonSchemaFolder: string, classname?: string): Entrypoint;
export declare function getClassEntrypoints(app: express.Express, file: string, pkgName: string, classname: string, jsonSchemaFolder: string, noDecorator: boolean): Entrypoint[];
export declare function getFunctions(distServerFolder: string, file: string): any;
