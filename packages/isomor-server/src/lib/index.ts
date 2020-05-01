export { server } from './server';
export { getApiDoc } from './apidoc';
export { startup } from './startup';
export { getIsomorRoutes, Route } from './route';
export { useIsomorHttp, HttpContext } from './use-isomor-http';
export {
    useIsomorWs,
    WsContext,
    setWsDefaultConfig,
    isomorWsEvent,
} from './use-isomor-ws';

import { HttpContext } from './use-isomor-http';
import { WsContext } from './use-isomor-ws';

export type Context = WsContext | HttpContext;
