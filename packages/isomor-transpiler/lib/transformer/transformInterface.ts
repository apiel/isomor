import * as traverse from 'traverse';
import { Statement } from '../ast';

// might have a look again at https://www.npmjs.com/package/esrecurse but need to find AST types for TS

export function transformInterface(root: Statement, noServerImport: boolean) {
    if (!noServerImport) { // keep interface as it is if noServerImport is false
        return root;
    }
    // only transform if noServerImport is true
    traverse(root).forEach(function(node: any) {
        if (node) {
            if (
                (node.type === 'TSTypeAnnotation' && node.typeAnnotation.type === 'TSTypeReference')
                || (
                    node.type === 'TSTypeAnnotation'
                    && node.typeAnnotation.type === 'TSArrayType'
                    && node.typeAnnotation.elementType.type === 'TSTypeReference'
                )
            ) {
                node.typeAnnotation = {
                    type: 'TSAnyKeyword',
                };
                this.update(node);
            }
        }
    });
    return root;
}
