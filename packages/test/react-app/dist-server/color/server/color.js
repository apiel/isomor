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
const fs_extra_1 = require("fs-extra");
const file = './data/color.txt';
function getColor() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield fs_extra_1.pathExists(file))) {
            return 'red';
        }
        return (yield fs_extra_1.readFile(file)).toString();
    });
}
exports.getColor = getColor;
function setColor(color = 'green') {
    return __awaiter(this, void 0, void 0, function* () {
        fs_extra_1.outputFile(file, color);
        return color;
    });
}
exports.setColor = setColor;
