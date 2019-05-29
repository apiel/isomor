import { warn } from 'logol';

import { JsonAst, FunctionDeclaration, ClassMethod, ArrowFunctionExpression } from '../../ast';
import { pushToQueue } from '../../validation';

type RootParams = FunctionDeclaration | ClassMethod | ArrowFunctionExpression;

export function getArgs(
    paramRoot: RootParams,
    srcFilePath: string,
    path: string,
    name: string,
    className?: string,
) {
    let args = paramRoot.params.map((param) => {
        if (param.type === 'Identifier') {
            return param.name;
        } else if (param.type === 'AssignmentPattern' && param.left.type === 'Identifier') {
            return param.left.name;
        }
    }).filter(param => param);
    if (args.length !== paramRoot.params.length) {
        // need to work on that to support as well ...
        warn('TransformFunc support only Identifier as params', srcFilePath, name);
        // console.log('paramRoot', JsonAst(paramRoot));
        args = [];
    } else {
        pushToQueue(args, srcFilePath, path, name, className);
    }
    return args;
}
