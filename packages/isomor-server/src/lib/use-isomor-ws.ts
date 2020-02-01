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
    logger?: Logger,
) {
    const routesIndex = getRoutesIndex(routes);
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (ws, req) => {
        ws.on('message', (message) => {
            if (isString(message)) {
                const data = JSON.parse(message);
                if (data?.action === 'API') {
                    apiAction(routesIndex, req, ws, data, logger);
                } else {
                    logger?.warn(`WS unknown message`, message);
                }
            }
        });
    });
}

async function apiAction(
    routesIndex: RoutesIndex,
    req: IncomingMessage,
    ws: WebSocket,
    data: { id: string, path: string, args: any[] },
    logger?: Logger,
) {
    const { id, path, args } = data;
    logger?.log(`WS ${path}`);
    if (routesIndex[path]) {
        const { validationSchema, fn, isClass } = routesIndex[path];
        try {
            const push = (payload: any) => ws.send(JSON.stringify({ action: 'PUSH', id, payload }));
            const ctx: WsContext = { req, ws, push };
            validateArgs(validationSchema, args);
            const result = isClass
                ? await fn.call(...args, req, ws, push)
                : await fn(ctx, ...args);
            ws.send(JSON.stringify({ action: 'API_RES', id, result }));
        } catch (error) {
            ws.send(JSON.stringify({ action: 'API_ERR', id, error }));
        }
    }
}

function getRoutesIndex(routes: Route[]): RoutesIndex {
    return routes.reduce((acc, route) => {
        acc[route.path] = route;
        return acc;
    }, {});
}
