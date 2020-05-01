import Debug from 'debug';

import { getCodeImport } from './code';
import { transformNode, FnOptions } from './transformNode';
import { isArray } from 'util';

import { Statement, JsonAst } from './ast';

const debug = Debug('isomor-transpiler:transform');

export default function transform(
    body: Statement[],
    fnOptions: FnOptions,
) {
    let newBody = [getCodeImport()];
    body.forEach((node) => {
        const newNode = transformNode(node, fnOptions);
        if (newNode) {
            if (isArray(newNode)) {
                newBody = [...newBody, ...newNode];
            } else {
                newBody = [...newBody, newNode];
            }
        } else {
            // console.log('remove code', JsonAst(node));
            debug('remove code', node.type);
        }
    });
    return newBody;
}
