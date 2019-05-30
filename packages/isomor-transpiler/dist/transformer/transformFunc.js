"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("../code");
const validation_1 = require("../validation");
function transformFunc(root, srcFilePath, path, withTypes) {
    const { name } = root.id;
    validation_1.setValidator(root, srcFilePath, path, name);
    return code_1.getCodeFunc(path, name, withTypes);
}
exports.transformFunc = transformFunc;
//# sourceMappingURL=transformFunc.js.map