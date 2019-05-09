import { ExportNamedDeclaration, Statement, ImportDeclaration } from './ast';
export declare function transformInterface(root: Statement): Statement;
export declare function transformImport(root: ImportDeclaration): ImportDeclaration;
export declare function transformExport(root: ExportNamedDeclaration, noServerImport?: boolean): ExportNamedDeclaration | Statement[];
export declare function transformClass(root: ExportNamedDeclaration): void;
