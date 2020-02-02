import { getCodeArrowFunc } from '../code';
import { VariableDeclaration } from '../ast';
import { setValidator } from '../validation';
import { FnOptions } from 'lib/transformNode';

export function transformArrowFunc(
    root: VariableDeclaration,
    {
        srcFilePath,
        path,
        wsReg,
        pkgName,
        withTypes,
    }: FnOptions,
) {
    const { declarations } = root;
    const declaration = declarations[0];
    if (declaration.type === 'VariableDeclarator'
        && declaration.init.type === 'ArrowFunctionExpression'
        && declaration.id.type === 'Identifier'
    ) {
        const { name } = declaration.id;
        setValidator(declaration.init, srcFilePath, path, name);
        return getCodeArrowFunc(wsReg, path, pkgName, name, withTypes);
    }
}
