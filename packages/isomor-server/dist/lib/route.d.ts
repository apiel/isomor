import { ValidationSchema } from 'isomor-core';
export interface Route {
    urlPath: string;
    file: string;
    validationSchema: ValidationSchema;
    fn: any;
}
export declare function getIsomorRoutes(moduleName: string, serverFolder: string, jsonSchemaFolder: string): Promise<Route[]>;
