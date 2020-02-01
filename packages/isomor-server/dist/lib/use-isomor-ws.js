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
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const { id, path, args } = data;
        (_a = logger) === null || _a === void 0 ? void 0 : _a.log(`WS req ${path}`);
        if (routesIndex[path]) {
            const { validationSchema, fn, isClass } = routesIndex[path];
            try {
                const push = (payload) => ws.send(JSON.stringify({ action: 'PUSH', id, payload }));
                const ctx = { req, ws, push };
                utils_1.validateArgs(validationSchema, args);
                const result = isClass
                    ? yield fn.call(...args, req, ws, push)
                    : yield fn(ctx, ...args);
                const msg = JSON.stringify({ action: 'API_RES', id, result });
                ws.send(msg);
                (_b = logger) === null || _b === void 0 ? void 0 : _b.log(`WS 200 ${path}`);
            }
            catch (error) {
                ws.send(JSON.stringify({ action: 'API_ERR', id, error }));
                (_c = logger) === null || _c === void 0 ? void 0 : _c.log(`WS 500 ${path}`, error);
            }
        }
        else {
            (_d = logger) === null || _d === void 0 ? void 0 : _d.log(`WS 404 ${path}`);
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