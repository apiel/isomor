import * as WebSocket from 'ws';
import { Route } from './route';
import { Server, IncomingMessage } from 'http';
import { isString } from 'util';
import { validateArgs } from './utils';

export interface WsContext {
    req: IncomingMessage;
    ws: WebSocket;
    push: (payload: any) => void;
}

interface Logger {
    log: (...ars: any) => void;
    warn: (...ars: any) => void;
}

interface RoutesIndex {
    [path: string]: Route;
}

//   {
//     "action": "API",
//     "id": 1234,
//     "path": "/isomor/isomor-example-react/color-server-color/getColor",
//     "args": []
//   }
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
        ws.on('message', (message) => {
            if (isString(message)) {
                const data = JSON.parse(message);
                if (data?.action === 'API') {
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
    data: { id: string, path: string, args: any[], cookie?: any },
    logger?: Logger,
) {
    const { id, path, args, cookie } = data;
    logger?.log(`WS req ${path}`);
    if (routesIndex[path]) {
        const { validationSchema, fn, isClass } = routesIndex[path];
        try {
            if (cookie) {
                req.headers.cookie = cookie;
            }
            const push = (payload: any) => {
                wsRefreshTimeout(ws, wsTimeout);
                const pushMsg = JSON.stringify({ action: 'PUSH', id, payload });
                logger?.log(`WS PUSH`, pushMsg.substring(0, 120), '...');
                return new Promise<boolean>((resolve) => {
                    ws.send(pushMsg, (err) => resolve(!err));
                });
            };
            const ctx: WsContext = { req, ws, push };
            validateArgs(validationSchema, args);
            const result = isClass
                ? await fn(...args, req, ws, push)
                : await fn.call(ctx, ...args);
            const msg = JSON.stringify({ action: 'API_RES', id, result });
            ws.send(msg);
            logger?.log(`WS 200 ${path}`);
            // console.log('msg', msg);
        } catch (error) {
            ws.send(JSON.stringify({ action: 'API_ERR', id, error: error?.message }));
            logger?.log(`WS 500 ${path}`, error);
        }
    } else {
        logger?.log(`WS 404 ${path}`);
    }
}

function getRoutesIndex(routes: Route[]): RoutesIndex {
    return routes.reduce((acc, route) => {
        acc[route.path] = route;
        return acc;
    }, {});
}
