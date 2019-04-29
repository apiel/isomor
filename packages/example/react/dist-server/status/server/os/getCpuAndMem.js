"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
function getCpuAndMem() {
    return {
        cpus: os.cpus(),
        totalmem: os.totalmem(),
        freemem: os.freemem(),
    };
}
exports.getCpuAndMem = getCpuAndMem;
