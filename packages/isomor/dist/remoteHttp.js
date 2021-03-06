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
let httpClient;
function setHttpClient(client = fetch) {
    httpClient = client;
}
exports.setHttpClient = setHttpClient;
function getHttpClient() {
    return httpClient || fetch;
}
function isomorRemoteHttp(baseUrl, moduleName, funcName, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = baseUrl + _1.getUrlPath(moduleName, funcName);
        const { result, error } = yield getHttpClient()(url, !args.length
            ? undefined
            : {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify({ args }),
            }).then(response => response.json());
        if (error) {
            throw error;
        }
        return result;
    });
}
exports.isomorRemoteHttp = isomorRemoteHttp;
//# sourceMappingURL=remoteHttp.js.map