import { getCodeType } from '../code';
import { TSTypeAliasDeclaration } from '../ast';

export function transformType(
    root: TSTypeAliasDeclaration,
) {
    return getCodeType(root.id.name);
}
