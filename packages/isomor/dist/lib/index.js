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
const urlPrefix = '/isomor';
function getUrlPath(path, pkgname, funcName, classname) {
    const url = classname
        ? `${urlPrefix}/${pkgname}/${path}/${classname}/${funcName}`
        : `${urlPrefix}/${pkgname}/${path}/${funcName}`;
    return url;
}
exports.getUrlPath = getUrlPath;
function isomorRemote(protocol, baseUrl, path, pkgname, funcName, args, classname) {
    if (protocol === 'ws') {
        return remoteWs_1.isomorRemoteWs(baseUrl, path, pkgname, funcName, args, classname);
    }
    return remoteHttp_1.isomorRemoteHttp(baseUrl, path, pkgname, funcName, args, classname);
}
exports.isomorRemote = isomorRemote;
function isomorShare(constructor) {
}
exports.isomorShare = isomorShare;
const isomorDecorators = [];
function isomor(constructor) {
    isomorDecorators.push(constructor.name);
}
exports.isomor = isomor;
function isIsomorClass(name) {
    return isomorDecorators.includes(name);
}
exports.isIsomorClass = isIsomorClass;
//# sourceMappingURL=index.js.map