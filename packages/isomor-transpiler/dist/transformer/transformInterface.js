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
//# sourceMappingURL=transformInterface.js.map