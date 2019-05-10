import * as traverse from 'traverse';
import { getCodeType } from './code';
import { ExportNamedDeclaration, Statement, ImportDeclaration } from './ast';
// might have a look again at https://www.npmjs.com/package/esrecurse but need to find AST types for TS


export function transformInterface(root: Statement) {
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

export function transformImport(root: ImportDeclaration) {
    if (root.source.type === 'Literal') {
        if (root.source.value[0] === '.') { // remove local import
            return null;
        }
        root.source.type = 'StringLiteral' as any;
    }
    // if (root.source.type === 'StringLiteral') {
    //     if (root.source.value[0] === '.') { // remove local import
    //         return null;
    //     }
    // }
    return root;
}

export function transformExport(
    root: ExportNamedDeclaration,
    noServerImport: boolean = false,
) {
    if (root.source.type === 'Literal') {
        if (root.source.value[0] === '.' || noServerImport) { // transform local export to types any
            return root.specifiers.map(({ exported: { name } }) => getCodeType(name));
        }
        root.source.type = 'StringLiteral' as any;
    }
    // if (root.source.type === 'StringLiteral') {
    //     if (root.source.value[0] === '.' || noServerImport) { // transform local export to types any
    //         return root.specifiers.map(({ exported: { name } }) => getCodeType(name));
    //     }
    //     // root.source.type = 'StringLiteral' as any;
    // }
    return root;
}

export function transformClass(
    root: ExportNamedDeclaration,
) {
    if (root.declaration.type === 'ClassDeclaration' && root.declaration.implements) {
        const isIsomorShare = root.declaration.implements.filter(
            ({ type, expression }) =>
                type === 'TSClassImplements'
                && expression.type === 'Identifier'
                && expression.name === 'IsomorShare',
        ).length > 0;
        root.declaration.implements[0].type = 'ClassImplements' as any; // to fix
        if (isIsomorShare) {
            return root;
        }
    }
    return;
}
