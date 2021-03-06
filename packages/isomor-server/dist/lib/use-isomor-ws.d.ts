/// <reference types="node" />
import * as WebSocket from 'ws';
import { WsConfig } from 'isomor';
import * as events from 'events';
import { Server, IncomingMessage } from 'http';
import { Route } from './route';
import { BaseContext } from './interface';
export interface WsContext extends BaseContext {
    type: 'ws';
    req: IncomingMessage;
    ws: WebSocket;
    push: (payload: any) => Promise<void>;
    setWsConfig: (config: WsConfig) => Promise<void>;
}
interface Logger {
    log: (...ars: any) => void;
    warn: (...ars: any) => void;
}
declare class IsomorWsEvent extends events.EventEmitter {
}
export declare const isomorWsEvent: IsomorWsEvent;
export declare function setWsDefaultConfig(config: WsConfig | undefined): void;
export declare function useIsomorWs(routes: Route[], server: Server, wsTimeout?: number, logger?: Logger): void;
export {};
