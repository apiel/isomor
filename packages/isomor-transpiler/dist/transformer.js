"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse = require("traverse");
const code_1 = require("./code");
function transformInterface(root) {
    traverse(root).forEach(function (node) {
        if (node) {
            if ((node.type === 'TSTypeAnnotation' && node.typeAnnotation.type === 'TSTypeReference')
                || (node.type === 'TSTypeAnnotation'
                    && node.typeAnnotation.type === 'TSArrayType'
                    && node.typeAnnotation.elementType.type === 'TSTypeReference')) {
                node.typeAnnotation = {
                    type: 'TSAnyKeyword',
                };
                this.update(node);
            }
        }
    });
    return root;
}
exports.transformInterface = transformInterface;
function transformImport(root) {
    if (root.source.type === 'StringLiteral') {
        if (root.source.value[0] === '.') {
            return null;
        }
    }
    return root;
}
exports.transformImport = transformImport;
function transformExport(root, noServerImport = false) {
    if (root.source.type === 'StringLiteral') {
        if (root.source.value[0] === '.' || noServerImport) {
            return root.specifiers.map(({ exported: { name } }) => code_1.getCodeType(name));
        }
    }
    return root;
}
exports.transformExport = transformExport;
function transformClass(root) {
    if (root.declaration.type === 'ClassDeclaration' && root.declaration.implements) {
        const isIsomorShare = root.declaration.implements.filter((node) => node.type === 'TSExpressionWithTypeArguments'
            && node.expression.type === 'Identifier'
            && node.expression.name === 'IsomorShare').length > 0;
        if (isIsomorShare) {
            return root;
        }
    }
    return;
}
exports.transformClass = transformClass;
//# sourceMappingURL=transformer.js.map