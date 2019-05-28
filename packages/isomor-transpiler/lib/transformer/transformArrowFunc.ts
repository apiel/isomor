import { getCodeArrowFunc } from '../code';
import { VariableDeclaration } from '../ast';

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
        // console.log('ArrowFunctionExpression', JsonAst(node));
        const { name } = declaration.id;
        return getCodeArrowFunc(path, name, [], withTypes);
    }
}
