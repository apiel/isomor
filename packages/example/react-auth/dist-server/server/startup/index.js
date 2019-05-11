"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("express-jwt");
const secret_1 = require("./secret");
function default_1(app) {
    app.use(jwt({
        secret: secret_1.secret,
        credentialsRequired: false,
        getToken: (req) => req.cookies.token,
    }));
}
exports.default = default_1;
