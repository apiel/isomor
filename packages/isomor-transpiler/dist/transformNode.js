"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("./code");
const transformClass_1 = require("./transformer/transformClass");
const transformImport_1 = require("./transformer/transformImport");
const transformInterface_1 = require("./transformer/transformInterface");
const transformExport_1 = require("./transformer/transformExport");
function transformNode(node, path, withTypes, noServerImport, noDecorator) {
    if (node.type === 'ExportNamedDeclaration') {
        if (!node.declaration) {
            return transformExport_1.transformExport(node, noServerImport);
        }
        else if (node.declaration.type === 'TSTypeAliasDeclaration') {
            return code_1.getCodeType(node.declaration.id.name);
        }
        else if (node.declaration.type === 'TSInterfaceDeclaration') {
            if (noServerImport) {
                return transformInterface_1.transformInterface(node);
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
            return transformClass_1.transformClass(node, path, withTypes, noDecorator);
        }
    }
    else if (node.type === 'ImportDeclaration') {
        return transformImport_1.transformImport(node, noServerImport);
    }
}
exports.transformNode = transformNode;
//# sourceMappingURL=transformNode.js.map