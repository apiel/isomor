import { getCodeFunc } from '../code';
import { FunctionDeclaration } from '../ast';
import { setValidator } from '../validation';
import { FnOptions } from 'lib/transformNode';

export function transformFunc(
    root: FunctionDeclaration,
    {
        srcFilePath,
        path,
        wsReg,
        pkgName,
        withTypes,
    }: FnOptions,
) {
    const { name } = root.id;
    setValidator(root, srcFilePath, path, name);
    return getCodeFunc(wsReg, path, pkgName, name, withTypes);
}
