/// <reference types="node" />
import * as WebSocket from 'ws';
import { Route } from './route';
import { Server, IncomingMessage } from 'http';
export interface WsContext {
    req: IncomingMessage;
    ws: WebSocket;
    push: (payload: any) => void;
}
interface Logger {
    log: (...ars: any) => void;
    warn: (...ars: any) => void;
}
export declare function useIsomorWs(routes: Route[], server: Server, logger?: Logger): void;
export {};
