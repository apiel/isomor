import { TSESTree } from '@typescript-eslint/typescript-estree';
import * as traverse from 'traverse';
// might have a look again at https://www.npmjs.com/package/esrecurse but need to find AST types for TS

export function transformInterface(root: TSESTree.Statement) {
    traverse(root).forEach(function(node: any) {
        if (node && node.type === 'TSTypeAnnotation' && node.typeAnnotation.type === 'TSTypeReference') {
            node.typeAnnotation = {
                type: 'TSAnyKeyword',
            };
            this.update(node);
        }
    });
    return root;
}
