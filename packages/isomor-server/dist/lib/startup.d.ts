import * as express from 'express';
export declare const getInstance: () => any;
export declare function loadStartupImport(distServerFolder: string, serverFolder: string, startupFile: string): Promise<void>;
export declare function startup(app: express.Express, distServerFolder: string, serverFolder: string, startupFile: string): Promise<void>;
