/// <reference types="node" />
import * as express from 'express';
import { Server } from 'http';
export declare function server({ port, moduleName, staticFolder, wsTimeout, serverFolder, startupFile, jsonSchemaFolder, }?: import("isomor-core").Options): Promise<{
    app: express.Express;
    server: Server;
}>;
