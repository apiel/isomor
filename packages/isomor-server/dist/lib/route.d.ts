import { ValidationSchema } from 'isomor-core';
export interface Route {
    path: string;
    file: string;
    validationSchema: ValidationSchema;
    fn: any;
    isClass: boolean;
}
export declare function getIsomorRoutes(serverFolder: string, distServerFolder: string, jsonSchemaFolder: string, noDecorator: boolean): Promise<Route[]>;
export declare function getRoute(file: string, pkgName: string, fn: any, name: string, jsonSchemaFolder: string, classname?: string): Route;
export declare function getClassRoutes(file: string, pkgName: string, classname: string, jsonSchemaFolder: string, noDecorator: boolean): Route[];
export declare function getFunctions(distServerFolder: string, file: string): any;
