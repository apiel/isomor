import { ExportNamedDeclaration } from '../ast';
export declare function transformExport(root: ExportNamedDeclaration, noServerImport?: boolean): ExportNamedDeclaration | import("@babel/types").Statement[];
