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
const _1 = require(".");
function isomorRemoteHttp(path, pkgname, funcName, args, classname) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = _1.getUrl(path, pkgname, funcName, classname);
        const { data: { result } } = yield axios_1.default.request(Object.assign({ url }, (args.length
            ? { method: 'POST', data: { args } }
            : { method: 'GET' })));
        return result;
    });
}
exports.isomorRemoteHttp = isomorRemoteHttp;
//# sourceMappingURL=remoteHttp.js.map