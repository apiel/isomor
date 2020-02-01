import { getCodeType } from './code';
import { Statement, JsonAst } from './ast';
import { transformClass } from './transformer/transformClass';
import { transformImport } from './transformer/transformImport';
import { transformInterface } from './transformer/transformInterface';
import { transformExport } from './transformer/transformExport';
import { transformFunc } from './transformer/transformFunc';
import { transformArrowFunc } from './transformer/transformArrowFunc';
import { transformType } from './transformer/transformType';

export function transformNode(
    node: Statement,
    srcFilePath: string,
    wsReg: RegExp | null,
    path: string,
    pkgName: string,
    withTypes: boolean,
    noServerImport: boolean,
    noDecorator: boolean,
) {
    if (node.type === 'ExportNamedDeclaration') {
        if (!node.declaration) {
            return transformExport(node, noServerImport);
        } else if (node.declaration.type === 'TSTypeAliasDeclaration') {
            return transformType(node.declaration);
        } else if (node.declaration.type === 'TSInterfaceDeclaration') {
            return transformInterface(node, noServerImport);
        } else if (node.declaration.type === 'FunctionDeclaration') {
            return transformFunc(node.declaration, srcFilePath, wsReg, path, pkgName, withTypes);
        } else if (node.declaration.type === 'VariableDeclaration') {
            return transformArrowFunc(node.declaration, srcFilePath, wsReg, path, pkgName, withTypes);
        } else if (node.declaration.type === 'ClassDeclaration') {
            return transformClass(node, srcFilePath, wsReg, path, pkgName, withTypes, noDecorator);
        }
    } else if (node.type === 'ImportDeclaration') {
        return transformImport(node, noServerImport);
    }
}
