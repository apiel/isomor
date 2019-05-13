"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const urlPrefix = '/isomor';
function getUrl(path, funcName, classname) {
    const url = classname
        ? `${urlPrefix}/${path}/${classname}/${funcName}`
        : `${urlPrefix}/${path}/${funcName}`;
    return url;
}
exports.getUrl = getUrl;
function remote(path, funcName, args, classname) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = getUrl(path, funcName, classname);
        const { data } = yield axios_1.default.post(url, { args });
        return data;
    });
}
exports.remote = remote;
//# sourceMappingURL=index.js.map