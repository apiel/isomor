import { ImportDeclaration } from '../ast';
import { JsonAst, parse } from '../ast';

export function transformImport(root: ImportDeclaration, noServerImport: boolean) {
    if (root.trailingComments) {
        if (root.trailingComments[0].value.indexOf(' > ') === 0) {
            const code = root.trailingComments[0].value.substring(3);
            const { program: { body } } = parse(code);
            return body;
        } else if (root.trailingComments[0].value.indexOf(' >') === 0) {
            return;
        }
    }
    if (noServerImport) {
        return;
    }
    if (root.source.type === 'StringLiteral') {
        if (root.source.value[0] === '.') { // remove local import
            return null;
        }
    }
    return root;
}
