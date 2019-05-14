import { ExportNamedDeclaration } from './ast';
export declare function transformClass(root: ExportNamedDeclaration, path: string, withTypes: boolean, noDecorator: boolean): any[] | ExportNamedDeclaration;
export declare function transformClassExportBeforeDecorator(root: any): any[];
