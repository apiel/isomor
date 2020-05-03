import { Options } from 'isomor-core';
export interface Route {
    urlPath: string;
    file: string;
    validationSchema: any;
    fn: any;
}
export declare function getIsomorRoutes(options: Options): Promise<Route[]>;
