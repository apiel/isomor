/// <reference types="node" />
import * as WebSocket from 'ws';
import { WsConfig } from 'isomor';
import { Route } from './route';
import { Server, IncomingMessage } from 'http';
export interface WsContext {
    req: IncomingMessage;
    ws: WebSocket;
    push: (payload: any) => Promise<void>;
    setWsConfig: (config: WsConfig) => Promise<void>;
}
interface Logger {
    log: (...ars: any) => void;
    warn: (...ars: any) => void;
}
export declare function setWsDefaultConfig(config: WsConfig | undefined): void;
export declare function useIsomorWs(routes: Route[], server: Server, wsTimeout?: number, logger?: Logger): void;
export {};
