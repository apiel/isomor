import { getCodeFunc } from '../code';
import { FunctionDeclaration } from '../ast';
import { setValidator } from '../validation';

export function transformFunc(
    root: FunctionDeclaration,
    srcFilePath: string,
    wsReg: RegExp | null,
    path: string,
    pkgName: string,
    withTypes: boolean,
) {
    const { name } = root.id;
    setValidator(root, srcFilePath, path, name);
    return getCodeFunc(wsReg, path, pkgName, name, withTypes);
}
