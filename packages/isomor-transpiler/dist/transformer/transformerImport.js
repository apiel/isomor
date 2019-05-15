"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
function transformImport(root, noServerImport) {
    if (root.trailingComments) {
        if (root.trailingComments[0].value.indexOf(' > ') === 0) {
            const code = root.trailingComments[0].value.substring(3);
            const { program: { body } } = ast_1.parse(code);
            return body;
        }
        else if (root.trailingComments[0].value.indexOf(' >') === 0) {
            return;
        }
    }
    if (noServerImport) {
        return;
    }
    if (root.source.type === 'StringLiteral') {
        if (root.source.value[0] === '.') {
            return null;
        }
    }
    return root;
}
exports.transformImport = transformImport;
//# sourceMappingURL=transformerImport.js.map