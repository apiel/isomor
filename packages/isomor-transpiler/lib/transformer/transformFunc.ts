import { getCodeFunc } from '../code';
import { FunctionDeclaration } from '../ast';
import { setValidator } from '../validation';

export function transformFunc(
    root: FunctionDeclaration,
    srcFilePath: string,
    path: string,
    pkgName: string,
    withTypes: boolean,
) {
    const { name } = root.id;
    setValidator(root, srcFilePath, path, name);
    return getCodeFunc(path, pkgName, name, withTypes);
}
