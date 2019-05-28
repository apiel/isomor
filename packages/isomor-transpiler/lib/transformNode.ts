import { getCodeType } from './code';
import { Statement, JsonAst } from './ast';
import { transformClass } from './transformer/transformClass';
import { transformImport } from './transformer/transformImport';
import { transformInterface } from './transformer/transformInterface';
import { transformExport } from './transformer/transformExport';
import { transformFunc } from './transformer/transformFunc';
import { transformArrowFunc } from './transformer/transformArrowFunc';

export function transformNode(
    node: Statement,
    path: string,
    withTypes: boolean,
    noServerImport: boolean,
    noDecorator: boolean,
) {
    if (node.type === 'ExportNamedDeclaration') {
        if (!node.declaration) {
            return transformExport(node, noServerImport);
        } else if (node.declaration.type === 'TSTypeAliasDeclaration') {
            return getCodeType(node.declaration.id.name); // lets create a transformType
        } else if (node.declaration.type === 'TSInterfaceDeclaration') {
            // console.log('TSInterfaceDeclaration', JsonAst(node));
            if (noServerImport) { // lets move this in transformInterface
                return transformInterface(node);
            } else {
                return node;
            }
        } else if (node.declaration.type === 'FunctionDeclaration') {
            // console.log('FunctionDeclaration', JsonAst(node));
            return transformFunc(node.declaration, path, withTypes);
        } else if (node.declaration.type === 'VariableDeclaration') {
            return transformArrowFunc(node.declaration, path, withTypes);
        } else if (node.declaration.type === 'ClassDeclaration') {
            return transformClass(node, path, withTypes, noDecorator);
        }
    } else if (node.type === 'ImportDeclaration') {
        return transformImport(node, noServerImport);
    }
}
