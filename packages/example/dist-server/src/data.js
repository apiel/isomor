"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isomor_1 = require("isomor");
const path_1 = require("path");
function getList(input) {
    const path = path_1.join(__dirname, '../server/data');
    return isomor_1.magic(() => require(path).getList, input);
}
exports.getList = getList;
//# sourceMappingURL=data.js.map