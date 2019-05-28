import {  getCodeFunc } from '../code';
import { FunctionDeclaration } from '../ast';

export function transformFunc(
    root: FunctionDeclaration,
    path: string,
    withTypes: boolean,
) {
    const { name } = root.id;
    return getCodeFunc(path, name, [], withTypes);
}
