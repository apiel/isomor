import { ExportNamedDeclaration, Statement, ImportDeclaration } from './ast';
export declare function transformInterface(root: Statement): Statement;
export declare function transformImport(root: ImportDeclaration, noServerImport: boolean): ImportDeclaration | Statement[];
export declare function transformExport(root: ExportNamedDeclaration, noServerImport?: boolean): ExportNamedDeclaration | Statement[];
