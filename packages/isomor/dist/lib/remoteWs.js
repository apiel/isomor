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
const reqQueue = {};
let wsReady = false;
function openWS() {
    ws = new WebSocket(`ws://${location.host}/isomor`);
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
        }
        else if (data.action === 'API_ERR') {
            (_b = reqQueue[data.id]) === null || _b === void 0 ? void 0 : _b.reject(data.error);
        }
    };
}
function waitForWs() {
    if (!ws) {
        openWS();
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
let reqId = 0;
function isomorRemoteWs(path, pkgname, funcName, args, classname) {
    return __awaiter(this, void 0, void 0, function* () {
        yield waitForWs();
        const id = reqId++;
        return new Promise((resolve, reject) => {
            reqQueue[id] = { id, resolve, reject };
            setTimeout(() => reject('request timeout'), 10000);
            ws.send(JSON.stringify({
                action: 'API',
                id,
                path: _1.getUrl(path, pkgname, funcName, classname),
                args,
            }));
        });
    });
}
exports.isomorRemoteWs = isomorRemoteWs;
//# sourceMappingURL=remoteWs.js.map