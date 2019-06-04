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
const getCpuAndMem_1 = require("./os/getCpuAndMem");
function getStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        return Object.assign({ uptime: process.uptime() }, getCpuAndMem_1.getCpuAndMem());
    });
}
exports.getStatus = getStatus;
