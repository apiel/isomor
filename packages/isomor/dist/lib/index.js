"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const remoteWs_1 = require("./remoteWs");
const remoteHttp_1 = require("./remoteHttp");
const urlPrefix = '/isomor';
function getUrl(path, pkgname, funcName, classname) {
    const url = classname
        ? `${urlPrefix}/${pkgname}/${path}/${classname}/${funcName}`
        : `${urlPrefix}/${pkgname}/${path}/${funcName}`;
    return url;
}
exports.getUrl = getUrl;
function isomorRemote(protocol, path, pkgname, funcName, args, classname) {
    if (protocol === 'ws') {
        return remoteWs_1.isomorRemoteWs(path, pkgname, funcName, args, classname);
    }
    return remoteHttp_1.isomorRemoteHttp(path, pkgname, funcName, args, classname);
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