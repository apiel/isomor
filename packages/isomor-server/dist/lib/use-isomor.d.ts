import * as express from 'express';
import { Entrypoint } from './entrypoint';
export declare function useIsomor(app: express.Express, distServerFolder: string, serverFolder: string, jsonSchemaFolder: string, noDecorator?: boolean): Promise<Entrypoint[]>;
