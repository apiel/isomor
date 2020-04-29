import { Statement } from './ast';
import { transformImport } from './transformer/transformImport';
import { transformInterface } from './transformer/transformInterface';
import { transformExport } from './transformer/transformExport';
import { transformFunc } from './transformer/transformFunc';
import { transformArrowFunc } from './transformer/transformArrowFunc';
import { transformType } from './transformer/transformType';

export interface FnOptions {
    srcFilePath: string;
    path: string;
    pkgName: string;
    withTypes: boolean;
    httpBaseUrl: string;
    wsBaseUrl: string;
    wsReg?: RegExp;
}

export function transformNode(
    node: Statement,
    fnOptions: FnOptions,
    noServerImport: boolean,
    noDecorator: boolean,
) {
    if (node.type === 'ExportNamedDeclaration') {
        // if (!node.declaration) {
        //     return transformExport(node, noServerImport);
        // } else 
        if (node.declaration.type === 'TSTypeAliasDeclaration') {
            return transformType(node.declaration);
        } else if (node.declaration.type === 'TSInterfaceDeclaration') {
            return transformInterface(node, noServerImport);
        } else if (node.declaration.type === 'FunctionDeclaration') {
            return transformFunc(node.declaration, fnOptions);
        } else if (node.declaration.type === 'VariableDeclaration') {
            return transformArrowFunc(node.declaration, fnOptions);
        } else if (node.declaration.type === 'TSEnumDeclaration') {
            return node;
        }
    } else if (node.type === 'ImportDeclaration') {
        return node;
        // return transformImport(node, noServerImport);
    }

    // we might need to keep interface and type
}
