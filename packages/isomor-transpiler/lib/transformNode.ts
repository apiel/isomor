import { getCodeFunc, getCodeArrowFunc, getCodeType } from './code';
import { Statement, JsonAst } from './ast';
import { transformClass } from './transformer/transformClass';
import { transformImport } from './transformer/transformImport';
import { transformInterface } from './transformer/transformInterface';
import { transformExport } from './transformer/transformExport';

export function transformNode(
    node: Statement,
    path: string,
    withTypes: boolean,
    noServerImport: boolean,
    noDecorator: boolean,
) {
    if (node.type === 'ExportNamedDeclaration') {
        if (!node.declaration) {
            // we migh want to transform `export { CpuInfo } from "os";` to `export type CpuInfo = any;`
            // console.log('node node declaration', JsonAst(node));
            // console.log('node node declaration', JsonAst(transformExport(node)));
            // console.log('transformExport', transformExport(node));
            return transformExport(node, noServerImport);
        } else if (node.declaration.type === 'TSTypeAliasDeclaration') {
            return getCodeType(node.declaration.id.name);
        } else if (node.declaration.type === 'TSInterfaceDeclaration') {
            // console.log('TSInterfaceDeclaration', JsonAst(node));
            if (noServerImport) {
                return transformInterface(node);
            } else {
                return node;
            }
        } else if (node.declaration.type === 'FunctionDeclaration') {
            // console.log('FunctionDeclaration', JsonAst(node));
            const { name } = node.declaration.id;
            return getCodeFunc(path, name, withTypes);
        } else if (node.declaration.type === 'VariableDeclaration') {
            const { declarations } = node.declaration;
            const declaration = declarations[0];
            if (declaration.type === 'VariableDeclarator'
                && declaration.init.type === 'ArrowFunctionExpression'
                && declaration.id.type === 'Identifier'
            ) {
                // console.log('ArrowFunctionExpression', JsonAst(node));
                const { name } = declaration.id;
                return getCodeArrowFunc(path, name, withTypes);
            }
        } else if (node.declaration.type === 'ClassDeclaration') {
            return transformClass(node, path, withTypes, noDecorator);
        }
    } else if (node.type === 'ImportDeclaration') {
        return transformImport(node, noServerImport);
    }
}
