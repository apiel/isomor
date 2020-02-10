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
let ws;
let reqId = 0;
const reqQueue = {};
let subId = 0;
const subscribedFunctions = {};
let wsReady = false;
function openWS(baseUrl) {
    ws = new WebSocket(baseUrl);
    ws.onopen = () => {
        wsReady = true;
    };
    ws.onclose = () => {
        wsReady = false;
        ws = null;
    };
    ws.onmessage = (msgEv) => {
        var _a, _b;
        const data = JSON.parse(msgEv.data);
        if (data.action === 'API_RES') {
            (_a = reqQueue[data.id]) === null || _a === void 0 ? void 0 : _a.resolve(data.result);
            delete (reqQueue[data.id]);
        }
        else if (data.action === 'API_ERR') {
            (_b = reqQueue[data.id]) === null || _b === void 0 ? void 0 : _b.reject(data.error);
            delete (reqQueue[data.id]);
        }
        else if (data.action === 'PUSH') {
            Object.values(subscribedFunctions).forEach(fn => fn(data.payload));
        }
    };
}
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
function isomorRemoteWs(baseUrl, path, pkgname, funcName, args, classname) {
    return __awaiter(this, void 0, void 0, function* () {
        yield waitForWs(baseUrl);
        const id = reqId++;
        return new Promise((resolve, reject) => {
            var _a, _b;
            reqQueue[id] = { id, resolve, reject };
            console.log('should cookie it', (_a = document) === null || _a === void 0 ? void 0 : _a.cookie);
            setTimeout(() => reject('request timeout'), 10000);
            ws.send(JSON.stringify({
                action: 'API',
                id,
                path: _1.getUrlPath(path, pkgname, funcName, classname),
                args,
                cookie: (_b = document) === null || _b === void 0 ? void 0 : _b.cookie,
            }));
        });
    });
}
exports.isomorRemoteWs = isomorRemoteWs;
function subscrib(fn) {
    const key = subId++;
    subscribedFunctions[key] = fn;
    return key;
}
exports.subscrib = subscrib;
function unsubscrib(key) {
    delete subscribedFunctions[key];
}
exports.unsubscrib = unsubscrib;
//# sourceMappingURL=remoteWs.js.map