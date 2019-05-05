import { TSESTree } from '@typescript-eslint/typescript-estree';
import Debug from 'debug';

import { getCodeImport } from './code';
import { transformNode } from './transformNode';
import { JsonAst } from './transformer.test';
import { isArray } from 'util';

const debug = Debug('isomor-transpiler:transform');

export default function transform(
    body: TSESTree.Statement[],
    path: string,
    withTypes: boolean = true,
    noServerImport: boolean = false,
) {
    let newBody = [getCodeImport()];
    body.forEach((node) => {
        const newNode = transformNode(node, path, withTypes, noServerImport);
        if (newNode) {
            if (isArray(newNode)) {
                newBody = [...newBody, ...newNode];
            } else {
                newBody = [...newBody, newNode];
            }
        } else {
            debug('remove code', node.type);
        }
    });
    return newBody;
}
