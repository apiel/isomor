import { warn } from 'logol';

import { JsonAst, Identifier, FunctionDeclaration, ClassMethod, ArrowFunctionExpression } from '../../ast';
import { pushToQueue } from '../../validation';

type RootParams = FunctionDeclaration | ClassMethod | ArrowFunctionExpression;

export function getArgs(
    paramRoot: RootParams,
    srcFilePath: string,
    path: string,
    name: string,
    className?: string,
) {
    const params = paramRoot.params.filter(({ type }) => type === 'Identifier') as Identifier[];
    let args = params.map((param) => param.name);
    if (params.length !== paramRoot.params.length) {
        // need to work on that to support as well ...
        warn('TransformFunc support only Identifier as params');
        args = [];
    } else {
        pushToQueue(args, srcFilePath, path, name, className);
    }
    return args;
}
