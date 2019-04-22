import * as express from 'express';
export interface Context {
    req: express.Request;
    res: express.Response;
    fn: any;
}
export declare function useIsomor(app: express.Express, distServerFolder: string, serverFolder: string): Promise<string[]>;
