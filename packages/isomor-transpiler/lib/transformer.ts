import * as traverse from 'traverse';
import { getCodeType, getCodeMethod, getCodeConstructor } from './code';
import { ExportNamedDeclaration, Statement, ImportDeclaration } from './ast';
import { JsonAst, parse } from './ast';

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

export function transformImport(root: ImportDeclaration, noServerImport: boolean) {
    if (root.trailingComments && root.trailingComments[0].value.indexOf(' > ') === 0) {
        const code = root.trailingComments[0].value.substring(3);
        const { program: { body } } = parse(code);
        return body;
    }
    if (noServerImport) {
        return;
    }
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
    path: string,
    withTypes: boolean,
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
        const { name: className } = root.declaration.id;
        const { body } = root.declaration.body;
        body.forEach((node, index) => {
            if (node.type === 'ClassMethod') {
                const { name } = node.key as any;
                if (name === 'constructor') {
                    (root as any).declaration.body.body[index] = getCodeConstructor(withTypes);
                } else {
                    (root as any).declaration.body.body[index] = getCodeMethod(path, name, className, withTypes);
                }
            } else if (node.type !== 'ClassProperty') {
                delete (root as any).declaration.body.body[index];
            }
        });
        return transformClassExportBeforeDecorator(root);
        // return root;
    }
    return;
}

// https://github.com/babel/babel/issues/7526
// https://github.com/tc39/proposal-decorators/issues/69
// created issue on TS to support it https://github.com/microsoft/TypeScript/issues/31370
export function transformClassExportBeforeDecorator(
    root: any,
) {
    const suffix = '__deco_export__';
    const rootDeco = JSON.parse(JSON.stringify(root.declaration)); // deep copy
    rootDeco.id.name += suffix;
    rootDeco.body.body = [];

    root.declaration.decorators = [];
    root.declaration.superClass = {
        type: 'Identifier',
        name: rootDeco.id.name,
    };

    return [rootDeco, root];
}
