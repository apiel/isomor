"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("./code");
const transformer_1 = require("./transformer");
function transformNode(node, path, withTypes, noServerImport) {
    if (node.type === 'ExportNamedDeclaration') {
        if (!node.declaration) {
            return transformer_1.transformExport(node, noServerImport);
        }
        else if (node.declaration.type === 'TSTypeAliasDeclaration') {
            return code_1.getCodeType(node.declaration.id.name);
        }
        else if (node.declaration.type === 'TSInterfaceDeclaration') {
            if (noServerImport) {
                return transformer_1.transformInterface(node);
            }
            else {
                return node;
            }
        }
        else if (node.declaration.type === 'FunctionDeclaration') {
            const { name } = node.declaration.id;
            return code_1.getCodeFunc(path, name, withTypes);
        }
        else if (node.declaration.type === 'VariableDeclaration') {
            const { declarations } = node.declaration;
            const declaration = declarations[0];
            if (declaration.type === 'VariableDeclarator'
                && declaration.init.type === 'ArrowFunctionExpression'
                && declaration.id.type === 'Identifier') {
                const { name } = declaration.id;
                return code_1.getCodeArrowFunc(path, name, withTypes);
            }
        }
        else if (node.declaration.type === 'ClassDeclaration') {
            return transformer_1.transformClass(node);
        }
    }
    else if (node.type === 'ImportDeclaration' && !noServerImport) {
        return transformer_1.transformImport(node);
    }
}
exports.transformNode = transformNode;
//# sourceMappingURL=transformNode.js.map