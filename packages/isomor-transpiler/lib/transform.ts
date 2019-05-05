import { TSESTree } from '@typescript-eslint/typescript-estree';
import Debug from 'debug';

import { getCodeImport } from './code';
import { transformNode } from './transformNode';
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
