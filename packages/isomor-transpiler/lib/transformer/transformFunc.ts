import { getCodeFunc } from '../code';
import { FunctionDeclaration } from '../ast';
import { getArgs } from './utils/getArgs';

export function transformFunc(
    root: FunctionDeclaration,
    srcFilePath: string,
    path: string,
    withTypes: boolean,
) {
    const { name } = root.id;
    const args = getArgs(root, srcFilePath, path, name);
    return getCodeFunc(path, name, args, withTypes);
}
