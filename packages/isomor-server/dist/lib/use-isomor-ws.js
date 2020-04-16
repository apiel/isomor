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
            var _a, _b;
            exports.isomorWsEvent.emit('message', ws, message);
            if (util_1.isString(message)) {
                const data = JSON.parse(message);
                if (((_a = data) === null || _a === void 0 ? void 0 : _a.action) === isomor_1.WsClientAction.API) {
                    apiAction(routesIndex, req, ws, wsTimeout, data, logger);
                }
                else {
                    (_b = logger) === null || _b === void 0 ? void 0 : _b.warn(`WS unknown message`, message);
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
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const { id, path, args, cookie } = data;
        (_a = logger) === null || _a === void 0 ? void 0 : _a.log(`WS req ${path}`);
        if (routesIndex[path]) {
            const { validationSchema, fn, isClass } = routesIndex[path];
            try {
                if (cookie) {
                    req.headers.cookie = cookie;
                }
                const send = wsSend(ws, wsTimeout, id, logger);
                const push = (payload) => send(isomor_1.WsServerAction.PUSH, payload);
                const setWsConfig = (config) => send(isomor_1.WsServerAction.CONF, config);
                const ctx = { req, ws, push, setWsConfig };
                utils_1.validateArgs(validationSchema, args);
                const result = isClass
                    ? yield fn(...args, req, ws, push)
                    : yield fn.call(ctx, ...args);
                yield send(isomor_1.WsServerAction.API_RES, result);
                (_b = logger) === null || _b === void 0 ? void 0 : _b.log(`WS 200 ${path}`);
            }
            catch (error) {
                (_c = logger) === null || _c === void 0 ? void 0 : _c.log(`WS 500 ${path}`, error);
                ws.send(JSON.stringify({ action: isomor_1.WsServerAction.API_ERR, id, payload: (_d = error) === null || _d === void 0 ? void 0 : _d.message }));
            }
        }
        else {
            (_e = logger) === null || _e === void 0 ? void 0 : _e.log(`WS 404 ${path}`);
        }
    });
}
function getRoutesIndex(routes) {
    return routes.reduce((acc, route) => {
        acc[route.path] = route;
        return acc;
    }, {});
}
const wsSend = (ws, wsTimeout, id, logger) => (action, payload) => {
    var _a;
    wsRefreshTimeout(ws, wsTimeout);
    const msg = JSON.stringify({ action, id, payload });
    (_a = logger) === null || _a === void 0 ? void 0 : _a.log(`WS ${action}`, msg.substring(0, 120), '...');
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