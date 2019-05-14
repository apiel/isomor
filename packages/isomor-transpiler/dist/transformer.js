"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse = require("traverse");
const code_1 = require("./code");
const ast_1 = require("./ast");
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
function transformImport(root, noServerImport) {
    if (root.trailingComments && root.trailingComments[0].value.indexOf(' > ') === 0) {
        const code = root.trailingComments[0].value.substring(3);
        const { program: { body } } = ast_1.parse(code);
        return body;
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
function transformExport(root, noServerImport = false) {
    if (root.source.type === 'StringLiteral') {
        if (root.source.value[0] === '.' || noServerImport) {
            return root.specifiers.map(({ exported: { name } }) => code_1.getCodeType(name));
        }
    }
    return root;
}
exports.transformExport = transformExport;
//# sourceMappingURL=transformer.js.map