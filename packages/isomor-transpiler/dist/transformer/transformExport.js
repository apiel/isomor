"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("../code");
function transformExport(root, noServerImport = false) {
    if (root.source.type === 'StringLiteral') {
        if (root.source.value[0] === '.' || noServerImport) {
            return root.specifiers.map(({ exported: { name } }) => code_1.getCodeType(name));
        }
    }
    return root;
}
exports.transformExport = transformExport;
//# sourceMappingURL=transformExport.js.map