"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse = require("traverse");
function transformInterface(root) {
    traverse(root).forEach(function (node) {
        if (node && node.type === 'TSTypeAnnotation' && node.typeAnnotation.type === 'TSTypeReference') {
            node.typeAnnotation = {
                type: 'TSAnyKeyword',
            };
            this.update(node);
        }
    });
    return root;
}
exports.transformInterface = transformInterface;
//# sourceMappingURL=transformer.js.map