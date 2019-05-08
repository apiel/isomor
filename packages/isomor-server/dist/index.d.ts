import * as express from 'express';
export interface Context {
    req: express.Request;
    res: express.Response;
    fn: any;
}
export declare function useIsomor(app: express.Express, distServerFolder: string, serverFolder: string): Promise<string[]>;
export declare function startup(app: express.Express, distServerFolder: string, serverFolder: string, startupFile: string): Promise<void>;
export declare function getSwaggerDoc(distServerFolder: string, serverFolder: string): Promise<{
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
