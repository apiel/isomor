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
function getAuth() {
    return __awaiter(this, void 0, void 0, function* () {
        const { req } = this;
        return req.cookies.username;
    });
}
exports.getAuth = getAuth;
function setAuth() {
    return __awaiter(this, void 0, void 0, function* () {
        const username = `user-${Math.floor(Math.random() * 1000)}`;
        const { res } = this;
        res.cookie('username', username, {
            expires: new Date(Date.now() + 5 * 60 * 1000),
            httpOnly: true,
        });
        return username;
    });
}
exports.setAuth = setAuth;
