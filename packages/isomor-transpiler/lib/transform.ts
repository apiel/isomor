import { TSESTree } from '@typescript-eslint/typescript-estree';
import Debug from 'debug';

import { getCodeFunc, getCodeArrowFunc, getCodeImport, getCodeType } from './code';
import { transformInterface } from './transformer';

const debug = Debug('isomor-transpiler:transform');

export default function transform(body: TSESTree.Statement[], path: string, withTypes: boolean = true) {
    body.forEach((node, index) => {
        if (node.type === 'ExportNamedDeclaration') {
            if (node.declaration.type === 'TSTypeAliasDeclaration') {
                body[index] = getCodeType(node.declaration.id.name);
            } else if (node.declaration.type === 'TSInterfaceDeclaration') {
                body[index] = transformInterface(node);
            } else if (node.declaration.type === 'FunctionDeclaration') {
                const { name } = node.declaration.id;
                body[index] = getCodeFunc(path, name, withTypes);
            } else if (node.declaration.type === 'VariableDeclaration') {
                const { declarations } = node.declaration;
                const declaration = declarations[0];
                if (declaration.type === 'VariableDeclarator'
                    && declaration.init.type === 'ArrowFunctionExpression'
                    && declaration.id.type === 'Identifier'
                ) {
                    const { name } = declaration.id;
                    body[index] = getCodeArrowFunc(path, name, withTypes);
                } else {
                    debug('remove code', declaration);
                    delete body[index];
                }
            } else {
                // console.log('remove code', node.declaration.type);
                debug('remove code', node.declaration.type);
                delete body[index];
            }
        } else {
            debug('remove code', node.type);
            delete body[index];
        }
    });
    body.unshift(getCodeImport());

    return body.filter(statement => statement);
}
