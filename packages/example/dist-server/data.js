"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isomor_1 = require("isomor");
function getList(...args) {
    return isomor_1.remote('data', 'getList', args);
}
exports.getList = getList;
