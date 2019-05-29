"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transformClass_1 = require("./transformer/transformClass");
const transformImport_1 = require("./transformer/transformImport");
const transformInterface_1 = require("./transformer/transformInterface");
const transformExport_1 = require("./transformer/transformExport");
const transformFunc_1 = require("./transformer/transformFunc");
const transformArrowFunc_1 = require("./transformer/transformArrowFunc");
const transformType_1 = require("./transformer/transformType");
function transformNode(node, srcFilePath, path, withTypes, noServerImport, noDecorator) {
    if (node.type === 'ExportNamedDeclaration') {
        if (!node.declaration) {
            return transformExport_1.transformExport(node, noServerImport);
        }
        else if (node.declaration.type === 'TSTypeAliasDeclaration') {
            return transformType_1.transformType(node.declaration);
        }
        else if (node.declaration.type === 'TSInterfaceDeclaration') {
            return transformInterface_1.transformInterface(node, noServerImport);
        }
        else if (node.declaration.type === 'FunctionDeclaration') {
            return transformFunc_1.transformFunc(node.declaration, srcFilePath, path, withTypes);
        }
        else if (node.declaration.type === 'VariableDeclaration') {
            return transformArrowFunc_1.transformArrowFunc(node.declaration, srcFilePath, path, withTypes);
        }
        else if (node.declaration.type === 'ClassDeclaration') {
            return transformClass_1.transformClass(node, srcFilePath, path, withTypes, noDecorator);
        }
    }
    else if (node.type === 'ImportDeclaration') {
        return transformImport_1.transformImport(node, noServerImport);
    }
}
exports.transformNode = transformNode;
//# sourceMappingURL=transformNode.js.map