import { getCodeArrowFunc } from '../code';
import { VariableDeclaration } from '../ast';
import { setValidator } from '../validation';

export function transformArrowFunc(
    root: VariableDeclaration,
    srcFilePath: string,
    path: string,
    pkgName: string,
    withTypes: boolean,
) {
    const { declarations } = root;
    const declaration = declarations[0];
    if (declaration.type === 'VariableDeclarator'
        && declaration.init.type === 'ArrowFunctionExpression'
        && declaration.id.type === 'Identifier'
    ) {
        const { name } = declaration.id;
        setValidator(declaration.init, srcFilePath, path, name);
        return getCodeArrowFunc(path, pkgName, name, withTypes);
    }
}
