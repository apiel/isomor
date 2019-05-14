"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("./code");
const transformer_1 = require("./transformer");
const transformerClass_1 = require("./transformerClass");
function transformNode(node, path, withTypes, noServerImport, noDecorator) {
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
            return transformerClass_1.transformClass(node, path, withTypes, noDecorator);
        }
    }
    else if (node.type === 'ImportDeclaration') {
        return transformer_1.transformImport(node, noServerImport);
    }
}
exports.transformNode = transformNode;
//# sourceMappingURL=transformNode.js.map