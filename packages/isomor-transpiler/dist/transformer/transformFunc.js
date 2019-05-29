"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("../code");
const getArgs_1 = require("./utils/getArgs");
function transformFunc(root, srcFilePath, path, withTypes) {
    const { name } = root.id;
    const args = getArgs_1.getArgs(root, srcFilePath, path, name);
    return code_1.getCodeFunc(path, name, args, withTypes);
}
exports.transformFunc = transformFunc;
//# sourceMappingURL=transformFunc.js.map