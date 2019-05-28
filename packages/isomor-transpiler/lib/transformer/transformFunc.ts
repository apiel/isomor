import { warn } from 'logol';

import { getCodeFunc } from '../code';
import { FunctionDeclaration, Identifier } from '../ast';

export function transformFunc(
    root: FunctionDeclaration,
    path: string,
    withTypes: boolean,
) {
    const { name } = root.id;
    const params = root.params.filter(({ type }) => type === 'Identifier') as Identifier[];
    let args = params.map((node) => node.name);
    if (params.length !== root.params.length) {
        warn('TransformFunc support only Identifier as params');
        args = [];
    }
    return getCodeFunc(path, name, args, withTypes);
}
