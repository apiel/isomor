"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse = require("traverse");
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
    if (root.type === 'ImportDeclaration' && root.source.type === 'Literal') {
        if (root.source.value[0] === '.') {
            return null;
        }
        root.source.type = 'StringLiteral';
    }
    return root;
}
exports.transformImport = transformImport;
function transformExport(root) {
    if (root.type === 'ExportNamedDeclaration' && root.source.type === 'Literal') {
        root.source.type = 'StringLiteral';
    }
    return root;
}
exports.transformExport = transformExport;
//# sourceMappingURL=transformer.js.map