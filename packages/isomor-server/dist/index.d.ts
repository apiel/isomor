import * as express from 'express';
export interface Context {
    req: express.Request;
    res: express.Response;
    fn: any;
}
export interface Entrypoint {
    path: string;
    file: string;
}
export declare function useIsomor(app: express.Express, distServerFolder: string, serverFolder: string, noDecorator?: boolean): Promise<Entrypoint[]>;
export declare function loadStartupImport(distServerFolder: string, serverFolder: string, startupFile: string): Promise<void>;
export declare function startup(app: express.Express, distServerFolder: string, serverFolder: string, startupFile: string): Promise<void>;
export declare function getSwaggerDoc(endpoints: Entrypoint[]): Promise<{
    swagger: string;
    info: {
        title: string;
        version: string;
    };
    paths: {};
    definitions: {
        Args: {
            type: string;
            required: string[];
            properties: {
                args: {
                    type: string;
                    example: any[];
                };
            };
        };
    };
    consumes: string[];
}>;
