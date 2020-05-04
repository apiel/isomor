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
const _1 = require(".");
var WsServerAction;
(function (WsServerAction) {
    WsServerAction["PUSH"] = "PUSH";
    WsServerAction["CONF"] = "CONF";
    WsServerAction["API_RES"] = "API_RES";
    WsServerAction["API_ERR"] = "API_ERR";
})(WsServerAction = exports.WsServerAction || (exports.WsServerAction = {}));
var WsClientAction;
(function (WsClientAction) {
    WsClientAction["API"] = "API";
})(WsClientAction = exports.WsClientAction || (exports.WsClientAction = {}));
exports.wsDefaultConfig = {
    withCookie: false,
};
let ws;
let reqId = 0;
const reqQueue = {};
let subId = 0;
const subscribedFunctions = {};
let wsReady = false;
let wsConfig = exports.wsDefaultConfig;
function setWsConfig(config) {
    wsConfig = config;
}
exports.setWsConfig = setWsConfig;
function openWS(baseUrl) {
    ws = new WebSocket(baseUrl);
    ws.onopen = () => {
        wsReady = true;
    };
    ws.onclose = () => {
        wsReady = false;
        ws = null;
    };
    ws.onmessage = msgEv => {
        var _a, _b;
        const data = JSON.parse(msgEv.data);
        if (data.action === WsServerAction.API_RES) {
            (_a = reqQueue[data.id]) === null || _a === void 0 ? void 0 : _a.resolve(data.payload);
            delete reqQueue[data.id];
        }
        else if (data.action === WsServerAction.API_ERR) {
            (_b = reqQueue[data.id]) === null || _b === void 0 ? void 0 : _b.reject(data.payload);
            delete reqQueue[data.id];
        }
        else if (data.action === WsServerAction.PUSH) {
            Object.values(subscribedFunctions).forEach(fn => fn && fn(data.payload));
        }
        else if (data.action === WsServerAction.CONF) {
            setWsConfig(data.payload);
        }
    };
}
exports.openWS = openWS;
function waitForWs(baseUrl) {
    if (!ws) {
        openWS(baseUrl);
    }
    return new Promise((resolve, reject) => {
        checkWs(resolve);
    });
}
function checkWs(resolve) {
    if (wsReady) {
        resolve();
    }
    setTimeout(() => checkWs(resolve), 100);
}
function isomorRemoteWs(baseUrl, moduleName, funcName, args) {
    return __awaiter(this, void 0, void 0, function* () {
        yield waitForWs(baseUrl);
        const id = reqId++;
        return new Promise((resolve, reject) => {
            reqQueue[id] = { id, resolve, reject };
            setTimeout(() => reject('request timeout'), 10000);
            ws.send(JSON.stringify(Object.assign({ action: WsClientAction.API, id, urlPath: _1.getUrlPath(moduleName, funcName), args }, ((wsConfig === null || wsConfig === void 0 ? void 0 : wsConfig.withCookie) && { cookie: document === null || document === void 0 ? void 0 : document.cookie }))));
        });
    });
}
exports.isomorRemoteWs = isomorRemoteWs;
function subscribe(fn) {
    const key = subId++;
    subscribedFunctions[key] = fn;
    return key;
}
exports.subscribe = subscribe;
function unsubscribe(key) {
    delete subscribedFunctions[key];
}
exports.unsubscribe = unsubscribe;
//# sourceMappingURL=remoteWs.js.map