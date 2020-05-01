import { HttpContext } from './use-isomor-http';
import { WsContext } from './use-isomor-ws';

export interface BaseContext {
    type: ContextType['type'];
}

export type ContextType = WsContext | HttpContext;
