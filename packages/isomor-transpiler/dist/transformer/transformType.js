"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("../code");
function transformType(root) {
    return code_1.getCodeType(root.id.name);
}
exports.transformType = transformType;
//# sourceMappingURL=transformType.js.map