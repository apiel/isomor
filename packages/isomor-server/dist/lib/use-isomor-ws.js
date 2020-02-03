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
const util_1 = require("util");
const utils_1 = require("./utils");
function useIsomorWs(routes, server, logger) {
    const routesIndex = getRoutesIndex(routes);
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (ws, req) => {
        ws.on('message', (message) => {
            var _a, _b;
            if (util_1.isString(message)) {
                const data = JSON.parse(message);
                if (((_a = data) === null || _a === void 0 ? void 0 : _a.action) === 'API') {
                    apiAction(routesIndex, req, ws, data, logger);
                }
                else {
                    (_b = logger) === null || _b === void 0 ? void 0 : _b.warn(`WS unknown message`, message);
                }
            }
        });
    });
}
exports.useIsomorWs = useIsomorWs;
function apiAction(routesIndex, req, ws, data, logger) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const { id, path, args } = data;
        (_a = logger) === null || _a === void 0 ? void 0 : _a.log(`WS req ${path}`);
        if (routesIndex[path]) {
            const { validationSchema, fn, isClass } = routesIndex[path];
            try {
                const push = (payload) => {
                    var _a;
                    const pushMsg = JSON.stringify({ action: 'PUSH', id, payload });
                    (_a = logger) === null || _a === void 0 ? void 0 : _a.log(`WS PUSH`, pushMsg.substring(0, 120), '...');
                    ws.send(pushMsg);
                };
                const ctx = { req, ws, push };
                utils_1.validateArgs(validationSchema, args);
                const result = isClass
                    ? yield fn(...args, req, ws, push)
                    : yield fn.call(ctx, ...args);
                const msg = JSON.stringify({ action: 'API_RES', id, result });
                ws.send(msg);
                (_b = logger) === null || _b === void 0 ? void 0 : _b.log(`WS 200 ${path}`);
            }
            catch (error) {
                ws.send(JSON.stringify({ action: 'API_ERR', id, error: (_c = error) === null || _c === void 0 ? void 0 : _c.message }));
                (_d = logger) === null || _d === void 0 ? void 0 : _d.log(`WS 500 ${path}`, error);
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
//# sourceMappingURL=use-isomor-ws.js.map