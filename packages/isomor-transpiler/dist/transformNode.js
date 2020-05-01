"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transformInterface_1 = require("./transformer/transformInterface");
const transformDefaultFunc_1 = require("./transformer/transformDefaultFunc");
const transformType_1 = require("./transformer/transformType");
function transformNode(node, fnOptions) {
    if (node.type === 'ExportDefaultDeclaration') {
        if (node.declaration.type === 'FunctionDeclaration') {
            return transformDefaultFunc_1.transformDefaultFunc(node.declaration, fnOptions);
        }
    }
    else if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration.type === 'TSTypeAliasDeclaration') {
            return transformType_1.transformType(node.declaration);
        }
        else if (node.declaration.type === 'TSInterfaceDeclaration') {
            return transformInterface_1.transformInterface(node);
        }
        else if (node.declaration.type === 'TSEnumDeclaration') {
            return node;
        }
    }
    else if (node.type === 'ImportDeclaration') {
        return node;
    }
}
exports.transformNode = transformNode;
//# sourceMappingURL=transformNode.js.map