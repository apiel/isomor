import Debug from 'debug';

import { getCodeImport } from './code';
import { transformNode } from './transformNode';
import { isArray } from 'util';

import { Statement, JsonAst } from './ast';

const debug = Debug('isomor-transpiler:transform');

export default function transform(
    body: Statement[],
    srcFilePath: string,
    path: string,
    wsReg: RegExp | null = null,
    pkgName: string = 'root',
    withTypes: boolean = true,
    noServerImport: boolean = false,
    noDecorator: boolean = false,
) {
    let newBody = [getCodeImport()];
    body.forEach((node) => {
        const newNode = transformNode(node, srcFilePath, wsReg, path, pkgName, withTypes, noServerImport, noDecorator);
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
