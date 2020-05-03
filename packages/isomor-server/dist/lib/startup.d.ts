import * as express from 'express';
import { Options } from 'isomor-core';
export declare const getInstance: () => any;
export declare function loadStartupImport({ serverFolder, startupFile }: Options, info?: (...args: any) => void): Promise<void>;
export declare function startup(app: express.Express, options: Options, info?: (...args: any) => void): Promise<void>;
