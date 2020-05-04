"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const isomor_1 = require("isomor");
const events = require("events");
const util_1 = require("util");
const utils_1 = require("./utils");
class IsomorWsEvent extends events.EventEmitter {
}
;
exports.isomorWsEvent = new IsomorWsEvent();
let defaultConfig;
function setWsDefaultConfig(config) {
    defaultConfig = config;
}
exports.setWsDefaultConfig = setWsDefaultConfig;
function useIsomorWs(routes, server, wsTimeout = 60, logger) {
    const routesIndex = getRoutesIndex(routes);
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (ws, req) => {
        wsRefreshTimeout(ws, wsTimeout);
        sendDefaultConfig(ws, wsTimeout, logger);
        exports.isomorWsEvent.emit('connection', ws, req);
        ws.on('message', (message) => {
            exports.isomorWsEvent.emit('message', ws, message);
            if (util_1.isString(message)) {
                const data = JSON.parse(message);
                if ((data === null || data === void 0 ? void 0 : data.action) === isomor_1.WsClientAction.API) {
                    apiAction(routesIndex, req, ws, wsTimeout, data, logger);
                }
                else {
                    logger === null || logger === void 0 ? void 0 : logger.warn(`WS unknown message`, message);
                }
            }
            wsRefreshTimeout(ws, wsTimeout);
        });
    });
}
exports.useIsomorWs = useIsomorWs;
let wsTimeoutHandler;
function wsRefreshTimeout(ws, wsTimeout) {
    if (wsTimeout) {
        clearTimeout(wsTimeoutHandler);
        wsTimeoutHandler = setTimeout(() => ws.close(), wsTimeout * 1000);
    }
}
function apiAction(routesIndex, req, ws, wsTimeout, data, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, urlPath, args, cookie } = data;
        logger === null || logger === void 0 ? void 0 : logger.log(`WS req ${urlPath}`);
        if (routesIndex[urlPath]) {
            const { validationSchema, fn } = routesIndex[urlPath];
            try {
                if (cookie) {
                    req.headers.cookie = cookie;
                }
                const send = wsSend(ws, wsTimeout, id, logger);
                const push = (payload) => send(isomor_1.WsServerAction.PUSH, payload);
                const setWsConfig = (config) => send(isomor_1.WsServerAction.CONF, config);
                const ctx = { type: 'ws', req, ws, push, setWsConfig };
                utils_1.validateArgs(validationSchema, args);
                const result = yield fn.call(ctx, ...args);
                yield send(isomor_1.WsServerAction.API_RES, result);
                logger === null || logger === void 0 ? void 0 : logger.log(`WS 200 ${urlPath}`);
            }
            catch (error) {
                logger === null || logger === void 0 ? void 0 : logger.log(`WS 500 ${urlPath}`, error);
                ws.send(JSON.stringify({ action: isomor_1.WsServerAction.API_ERR, id, payload: error === null || error === void 0 ? void 0 : error.message }));
            }
        }
        else {
            logger === null || logger === void 0 ? void 0 : logger.log(`WS 404 ${urlPath}`);
        }
    });
}
function getRoutesIndex(routes) {
    return routes.reduce((acc, route) => {
        acc[route.urlPath] = route;
        return acc;
    }, {});
}
const wsSend = (ws, wsTimeout, id, logger) => (action, payload) => {
    wsRefreshTimeout(ws, wsTimeout);
    const msg = JSON.stringify({ action, id, payload });
    logger === null || logger === void 0 ? void 0 : logger.log(`WS ${action}`, msg.substring(0, 120), '...');
    return new Promise((resolve, reject) => {
        ws.send(msg, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
};
function sendDefaultConfig(ws, wsTimeout, logger) {
    if (defaultConfig) {
        logger.log('WS send default config', defaultConfig);
        wsSend(ws, wsTimeout, undefined, logger)(isomor_1.WsServerAction.CONF, defaultConfig);
    }
}
//# sourceMappingURL=use-isomor-ws.js.map