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
const secret_1 = require("./startup/secret");
function setUser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = input;
        if (username !== 'demo' && password !== '1234') {
            this.res.status(401);
            return 'Invalid credentials';
        }
        const jwt = yield secret_1.generateToken(input);
        const cookieOptions = {
            maxAge: secret_1.expiresIn * 1000,
            httpOnly: true,
        };
        this.res.cookie('token', jwt, cookieOptions);
        return username;
    });
}
exports.setUser = setUser;
function getUser() {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.req.user && this.req.user.username) {
            return this.req.user.username;
        }
    });
}
exports.getUser = getUser;
