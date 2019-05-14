"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
function getUptime() {
    return os_1.uptime();
}
exports.getUptime = getUptime;
