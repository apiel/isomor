import { basename, extname } from 'path';

import { FnOptions } from '../transformNode';
import { getCodeFunc, getBodyEmptyReturn } from '../code';
import { FunctionDeclaration, Statement, JsonAst } from '../ast';
import { setValidator } from '../validation';

// ToDo default params value does not work
// function(color: string = 'green')
// or it might work, server side

// when build for declaration there should be all import export
// when build js be only isomor
// actually for JS, we could just use a template file, since they all look exactly the same

export function transformDefaultFunc(
    root: FunctionDeclaration,
    { srcFilePath, declaration, ...bodyParams }: FnOptions,
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
        bodyParams: { name, ...bodyParams },
    });
}
