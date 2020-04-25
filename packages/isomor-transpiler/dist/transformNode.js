"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transformImport_1 = require("./transformer/transformImport");
const transformInterface_1 = require("./transformer/transformInterface");
const transformFunc_1 = require("./transformer/transformFunc");
const transformArrowFunc_1 = require("./transformer/transformArrowFunc");
const transformType_1 = require("./transformer/transformType");
function transformNode(node, fnOptions, noServerImport, noDecorator) {
    if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration.type === 'TSTypeAliasDeclaration') {
            return transformType_1.transformType(node.declaration);
        }
        else if (node.declaration.type === 'TSInterfaceDeclaration') {
            return transformInterface_1.transformInterface(node, noServerImport);
        }
        else if (node.declaration.type === 'FunctionDeclaration') {
            return transformFunc_1.transformFunc(node.declaration, fnOptions);
        }
        else if (node.declaration.type === 'VariableDeclaration') {
            return transformArrowFunc_1.transformArrowFunc(node.declaration, fnOptions);
        }
        else if (node.declaration.type === 'TSEnumDeclaration') {
            return node;
        }
    }
    else if (node.type === 'ImportDeclaration') {
        return transformImport_1.transformImport(node, noServerImport);
    }
}
exports.transformNode = transformNode;
//# sourceMappingURL=transformNode.js.map