"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const remoteHttp_1 = require("./remoteHttp");
const remoteWs_1 = require("./remoteWs");
var remoteWs_2 = require("./remoteWs");
exports.subscribe = remoteWs_2.subscribe;
exports.unsubscribe = remoteWs_2.unsubscribe;
exports.WsServerAction = remoteWs_2.WsServerAction;
exports.WsClientAction = remoteWs_2.WsClientAction;
exports.wsDefaultConfig = remoteWs_2.wsDefaultConfig;
exports.setWsConfig = remoteWs_2.setWsConfig;
exports.openWS = remoteWs_2.openWS;
const urlPrefix = '/isomor';
let httpBaseUrl;
let wsBaseUrl;
function getUrlPath(moduleName, funcName) {
    return `${urlPrefix}/${moduleName}/${funcName}`;
}
exports.getUrlPath = getUrlPath;
function setHttpBaseUrl(baseUrl) {
    httpBaseUrl = baseUrl;
}
exports.setHttpBaseUrl = setHttpBaseUrl;
function setWsBaseUrl(baseUrl) {
    wsBaseUrl = baseUrl;
}
exports.setWsBaseUrl = setWsBaseUrl;
function isomorRemote(protocol, baseUrl, moduleName, funcName, args) {
    if (protocol === 'ws') {
        return remoteWs_1.isomorRemoteWs(wsBaseUrl || baseUrl, moduleName, funcName, args);
    }
    return remoteHttp_1.isomorRemoteHttp(httpBaseUrl || baseUrl, moduleName, funcName, args);
}
exports.isomorRemote = isomorRemote;
//# sourceMappingURL=index.js.map