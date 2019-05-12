import * as traverse from 'traverse';
import { getCodeType } from './code';
import { ExportNamedDeclaration, Statement, ImportDeclaration } from './ast';
import { JsonAst } from './ast';
// might have a look again at https://www.npmjs.com/package/esrecurse but need to find AST types for TS

export function transformInterface(root: Statement) {
    traverse(root).forEach(function (node: any) {
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

export function transformImport(root: ImportDeclaration) {
    if (root.source.type === 'StringLiteral') {
        if (root.source.value[0] === '.') { // remove local import
            return null;
        }
    }
    return root;
}

export function transformExport(
    root: ExportNamedDeclaration,
    noServerImport: boolean = false,
) {
    if (root.source.type === 'StringLiteral') {
        if (root.source.value[0] === '.' || noServerImport) { // transform local export to types any
            return root.specifiers.map(({ exported: { name } }) => getCodeType(name));
        }
        // root.source.type = 'StringLiteral' as any;
    }
    return root;
}

export function transformClass(
    root: ExportNamedDeclaration,
) {
    if (root.declaration.type === 'ClassDeclaration') {
        if (root.declaration.implements) {
            const isIsomorShare = root.declaration.implements.filter(
                (node) =>
                    node.type === 'TSExpressionWithTypeArguments'
                    && node.expression.type === 'Identifier'
                    && node.expression.name === 'IsomorShare',
            ).length > 0;
            if (isIsomorShare) {
                return root;
            }
        }
        // Class didn't implemented IsomorShare we can transform it
        // console.log('ClassDeclaration', JsonAst(root));
        const { body } = root.declaration.body;
        body.forEach((node, index) => {
            if (node.type === 'ClassMethod') {
                //
            } else if (node.type !== 'ClassProperty') {
                delete (root as any).declaration.body.body[index];
            }
        });
    }
    return;
}
