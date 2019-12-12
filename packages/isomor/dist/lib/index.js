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
const axios_1 = require("axios");
const urlPrefix = '/isomor';
function getUrl(path, pkgname, funcName, classname) {
    const url = classname
        ? `${urlPrefix}/${pkgname}/${path}/${classname}/${funcName}`
        : `${urlPrefix}/${pkgname}/${path}/${funcName}`;
    return url;
}
exports.getUrl = getUrl;
function isomorRemote(path, pkgname, funcName, args, classname) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = getUrl(path, pkgname, funcName, classname);
        const { data: { result } } = yield axios_1.default.request(Object.assign({ url }, (args.length
            ? { method: 'POST', data: { args } }
            : { method: 'GET' })));
        return result;
    });
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