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
function getUrlPath(moduleName, funcName) {
    return `${urlPrefix}/${moduleName}/${funcName}`;
}
exports.getUrlPath = getUrlPath;
function isomorRemote(protocol, baseUrl, moduleName, funcName, args) {
    if (protocol === 'ws') {
        return remoteWs_1.isomorRemoteWs(baseUrl, moduleName, funcName, args);
    }
    return remoteHttp_1.isomorRemoteHttp(baseUrl, moduleName, funcName, args);
}
exports.isomorRemote = isomorRemote;
//# sourceMappingURL=index.js.map