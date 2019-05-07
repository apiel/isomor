import { TSESTree } from '@typescript-eslint/typescript-estree';
import Debug from 'debug';

import { getCodeFunc, getCodeArrowFunc, getCodeType } from './code';
import { transformInterface, transformImport, transformExport } from './transformer';
import { JsonAst } from './transformer.test';

const debug = Debug('isomor-transpiler:transformNode');

export function transformNode(
    node: TSESTree.Statement,
    path: string,
    withTypes: boolean,
    noServerImport: boolean,
) {
    if (node.type === 'ExportNamedDeclaration') {
        if (!node.declaration) {
            // we migh want to transform `export { CpuInfo } from "os";` to `export type CpuInfo = any;`
            // console.log('node node declaration', JsonAst(node));
            // console.log('node node declaration', JsonAst(transformExport(node)));
            // console.log('transformExport', transformExport(node));
            return transformExport(node, noServerImport);
        } else if (node.declaration.type === 'TSTypeAliasDeclaration') {
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