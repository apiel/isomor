import { getCodeFunc, getBody } from '../code';
import { FunctionDeclaration, Statement, JsonAst } from '../ast';
import { setValidator } from '../validation';
import { FnOptions } from 'lib/transformNode';

export function transformFunc(
    root: FunctionDeclaration,
    {
        srcFilePath,
        path,
        withTypes,
        ...bodyParams
    }: FnOptions,
) {
    // console.log('rrrrrrrrrrooot-before', JsonAst(root));
    const { name } = root.id;
    setValidator(root, srcFilePath, path, name);

    // console.log('root.params', root.params);
    root.body = getBody({ path, name, ...bodyParams }, root.params) as any;

    // console.log('rrrrrrrrrrooot-after', JsonAst(root));

    // return getCodeFunc({
    //     withTypes,
    //     bodyParams: { path, name, ...bodyParams },
    // });
    return {
        type: 'ExportNamedDeclaration',
        declaration: root,
    } as any as Statement;
}
