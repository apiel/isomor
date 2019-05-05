import { TSESTree } from '@typescript-eslint/typescript-estree';
import Debug from 'debug';

import { getCodeFunc, getCodeArrowFunc, getCodeImport, getCodeType } from './code';
import { transformInterface, transformImport } from './transformer';
import { JsonAst } from './transformer.test';

const debug = Debug('isomor-transpiler:transform');

export default function transform(
    body: TSESTree.Statement[],
    path: string,
    withTypes: boolean = true,
    noServerImport: boolean = false,
) {
    body.forEach((node, index) => {
        const newNode = transformNode(node, path, withTypes, noServerImport);
        if (newNode) {
            body[index] = newNode;
        } else {
            // console.log('delete node', JsonAst(node));
            debug('remove code', node.type);
            delete body[index];
        }
    });
    body.unshift(getCodeImport());

    return body.filter(statement => statement);
}

function transformNode(
    node: TSESTree.Statement,
    path: string,
    withTypes: boolean,
    noServerImport: boolean,
) {
    if (node.type === 'ExportNamedDeclaration') {
        // if (node.declaration) {
        if (node.declaration.type === 'TSTypeAliasDeclaration') {
            return getCodeType(node.declaration.id.name);
        } else if (node.declaration.type === 'TSInterfaceDeclaration') {
            // console.log('TSInterfaceDeclaration', JsonAst(node));
            if (noServerImport) {
                return transformInterface(node);
            } else {
                return node;
            }
        } else if (node.declaration.type === 'FunctionDeclaration') {
            const { name } = node.declaration.id;
            return getCodeFunc(path, name, withTypes);
        } else if (node.declaration.type === 'VariableDeclaration') {
            const { declarations } = node.declaration;
            const declaration = declarations[0];
            if (declaration.type === 'VariableDeclarator'
                && declaration.init.type === 'ArrowFunctionExpression'
                && declaration.id.type === 'Identifier'
            ) {
                const { name } = declaration.id;
                return getCodeArrowFunc(path, name, withTypes);
            }
        }
    } else if (node.type === 'ImportDeclaration' && !noServerImport) {
        return transformImport(node);
    }
}
