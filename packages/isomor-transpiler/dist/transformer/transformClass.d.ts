import { ExportNamedDeclaration } from '../ast';
export declare function transformClass(root: ExportNamedDeclaration, srcFilePath: string, wsReg: RegExp | null, path: string, pkgName: string, withTypes: boolean, noDecorator: boolean): any[] | ExportNamedDeclaration;
export declare function transformClassExportBeforeDecorator(root: any): any[];
