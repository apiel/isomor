import * as WebSocket from 'ws';
import { WsClientAction, WsServerAction, WsConfig } from 'isomor';
import * as events from 'events';
import { Server, IncomingMessage } from 'http';
import { isString } from 'util';

import { Route } from './route';
import { validateArgs } from './utils';
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

interface RoutesIndex {
    [path: string]: Route;
}

class IsomorWsEvent extends events.EventEmitter {};
export const isomorWsEvent = new IsomorWsEvent();

let defaultConfig: WsConfig | undefined;
export function setWsDefaultConfig(config: WsConfig | undefined) {
    defaultConfig = config;
}

export function useIsomorWs(
    routes: Route[],
    server: Server,
    wsTimeout: number = 60,
    logger?: Logger,
) {
    const routesIndex = getRoutesIndex(routes);
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (ws, req) => {
        wsRefreshTimeout(ws, wsTimeout);
        sendDefaultConfig(ws, wsTimeout, logger);
        isomorWsEvent.emit('connection', ws, req);
        ws.on('message', (message) => {
            isomorWsEvent.emit('message', ws, message);
            if (isString(message)) {
                const data = JSON.parse(message);
                if (data?.action === WsClientAction.API) {
                    apiAction(routesIndex, req, ws, wsTimeout, data, logger);
                } else {
                    logger?.warn(`WS unknown message`, message);
                }
            }
            wsRefreshTimeout(ws, wsTimeout);
        });
    });
}

let wsTimeoutHandler: NodeJS.Timeout;
function wsRefreshTimeout(ws: WebSocket, wsTimeout: number) {
    if (wsTimeout) {
        clearTimeout(wsTimeoutHandler);
        wsTimeoutHandler = setTimeout(() => ws.close(), wsTimeout * 1000);
    }
}

async function apiAction(
    routesIndex: RoutesIndex,
    req: IncomingMessage,
    ws: WebSocket,
    wsTimeout: number,
    data: { id: string, urlPath: string, args: any[], cookie?: any },
    logger?: Logger,
) {
    const { id, urlPath, args, cookie } = data;
    logger?.log(`WS req ${urlPath}`);
    if (routesIndex[urlPath]) {
        const { validationSchema, fn } = routesIndex[urlPath];
        try {
            if (cookie) {
                req.headers.cookie = cookie;
            }
            const send = wsSend(ws, wsTimeout, id, logger);
            const push = (payload: any) => send(WsServerAction.PUSH, payload);
            const setWsConfig = (config: WsConfig) => send(WsServerAction.CONF, config);
            const ctx: WsContext = { type: 'ws', req, ws, push, setWsConfig };
            validateArgs(validationSchema, args);
            const result = await fn.call(ctx, ...args);
            await send(WsServerAction.API_RES, result);
            logger?.log(`WS 200 ${urlPath}`);
            // console.log('msg', msg);
        } catch (error) {
            logger?.log(`WS 500 ${urlPath}`, error);
            ws.send(JSON.stringify({ action: WsServerAction.API_ERR, id, payload: error?.message }));
        }
    } else {
        logger?.log(`WS 404 ${urlPath}`);
    }
}

function getRoutesIndex(routes: Route[]): RoutesIndex {
    return routes.reduce((acc, route) => {
        acc[route.urlPath] = route;
        return acc;
    }, {});
}


const wsSend = (
    ws: WebSocket,
    wsTimeout: number,
    id?: string,
    logger?: Logger,
) => (
    action: WsServerAction,
    payload: any,
): Promise<void> => {
    wsRefreshTimeout(ws, wsTimeout);
    const msg = JSON.stringify({ action, id, payload });
    logger?.log(`WS ${action}`, msg.substring(0, 120), '...');
    return new Promise((resolve, reject) => {
        ws.send(msg, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

function sendDefaultConfig(
    ws: WebSocket,
    wsTimeout: number,
    logger?: Logger,
) {
    if (defaultConfig) {
        logger.log('WS send default config', defaultConfig);
        wsSend(ws, wsTimeout, undefined, logger)(WsServerAction.CONF, defaultConfig);
    }
}