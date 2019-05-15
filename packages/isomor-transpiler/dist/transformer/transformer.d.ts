import { ExportNamedDeclaration, Statement } from '../ast';
export declare function transformInterface(root: Statement): Statement;
export declare function transformExport(root: ExportNamedDeclaration, noServerImport?: boolean): ExportNamedDeclaration | Statement[];
