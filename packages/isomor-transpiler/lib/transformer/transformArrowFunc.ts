import { VariableDeclaration } from '../ast';
import { setValidator } from '../validation';
import { FnOptions } from 'lib/transformNode';

export function transformArrowFunc(
    root: VariableDeclaration,
    {
        srcFilePath,
        ...bodyParams
    }: FnOptions,
) {
    // const { declarations } = root;
    // const declaration = declarations[0];
    // if (declaration.type === 'VariableDeclarator'
    //     && declaration.init.type === 'ArrowFunctionExpression'
    //     && declaration.id.type === 'Identifier'
    // ) {
    //     const { name } = declaration.id;
    //     setValidator(declaration.init, srcFilePath, path, name);
    //     return getCodeArrowFunc({
    //         withTypes,
    //         bodyParams: { path, name, ...bodyParams },
    //     });
    // }
    console.log('TBD.');
}
