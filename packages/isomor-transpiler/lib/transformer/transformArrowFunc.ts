import { getCodeArrowFunc } from '../code';
import { VariableDeclaration, Identifier, JsonAst } from '../ast';
import { warn } from 'logol';

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
        // console.log('ArrowFunctionExpression', JsonAst(declaration));
        const { name } = declaration.id;
        const params = declaration.init.params.filter(({ type }) => type === 'Identifier') as Identifier[];
        let args = params.map((node) => node.name);
        if (params.length !== declaration.init.params.length) {
            warn('TransformFunc support only Identifier as params');
            args = [];
        }
        return getCodeArrowFunc(path, name, args, withTypes);
    }
}
