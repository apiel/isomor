import * as express from 'express';
import { Entrypoint } from './entrypoint';
export declare function useIsomor(app: express.Express, distServerFolder: string, serverFolder: string, noDecorator?: boolean): Promise<Entrypoint[]>;
