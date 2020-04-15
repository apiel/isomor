/// <reference types="node" />
import * as express from 'express';
import { Server } from 'http';
export declare function server(): Promise<{
    app: express.Express;
    server: Server;
}>;
