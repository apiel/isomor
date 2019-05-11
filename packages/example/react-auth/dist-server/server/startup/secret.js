"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
exports.secret = 'secret-to-keep-safe';
exports.expiresIn = 30 * 60;
function generateToken(user) {
    const jwt = {
        username: user.username,
    };
    return jsonwebtoken_1.sign(jwt, exports.secret, { expiresIn: exports.expiresIn });
}
exports.generateToken = generateToken;
