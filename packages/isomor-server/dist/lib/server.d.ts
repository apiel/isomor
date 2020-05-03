/// <reference types="node" />
import * as express from 'express';
import { Options } from 'isomor-core';
import { Server } from 'http';
export declare function server(options?: Options): Promise<{
    app: express.Express;
    server: Server;
}>;
