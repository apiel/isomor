import { basename, extname } from 'path';

import { FnOptions } from '../transformNode';
import { getCodeFunc, getBodyEmptyReturn } from '../code';
import { FunctionDeclaration, Statement, JsonAst } from '../ast';
import { setValidator } from '../validation';

// ToDo default params value does not work
// function(color: string = 'green')

export function transformDefaultFunc(
    root: FunctionDeclaration,
    { srcFilePath, path, withTypes, declaration, ...bodyParams }: FnOptions,
) {
    const name = basename(srcFilePath, extname(srcFilePath));

    if (declaration) {
        root.body = getBodyEmptyReturn() as any;

        return ({
            type: 'ExportDefaultDeclaration',
            declaration: root,
        } as any) as Statement;
    }

    // ToDo restore validator
    // setValidator(root, srcFilePath, path, name);

    return getCodeFunc({
        withTypes,
        bodyParams: { path, name, ...bodyParams },
    });
}
