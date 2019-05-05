import { TSESTree } from '@typescript-eslint/typescript-estree';
import * as traverse from 'traverse';
// might have a look again at https://www.npmjs.com/package/esrecurse but need to find AST types for TS

export function transformInterface(root: TSESTree.Statement) {
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

export function transformImport(root: TSESTree.Statement) {
    if (root.type === 'ImportDeclaration' && root.source.type === 'Literal') {
        if (root.source.value[0] === '.') { // remove local import
            return null;
        }
        root.source.type = 'StringLiteral' as any;
    }
    return root;
}

export function transformExport(root: TSESTree.Statement) {
    if (root.type === 'ExportNamedDeclaration' && root.source.type === 'Literal') {
        root.source.type = 'StringLiteral' as any;
    }
    return root;
}
