import { getCodeArrowFunc } from '../code';
import { VariableDeclaration } from '../ast';
import { getArgs } from './utils/getArgs';

export function transformArrowFunc(
    root: VariableDeclaration,
    path: string,
    withTypes: boolean,
) {
    const { declarations } = root;
    const declaration = declarations[0];
    if (declaration.type === 'VariableDeclarator'
        && declaration.init.type === 'ArrowFunctionExpression'
        && declaration.id.type === 'Identifier'
    ) {
        const { name } = declaration.id;
        const args = getArgs(declaration.init);
        return getCodeArrowFunc(path, name, args, withTypes);
    }
}
