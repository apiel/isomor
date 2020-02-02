import { ExportNamedDeclaration } from '../ast';
import { FnOptions } from 'lib/transformNode';
export declare function transformClass(root: ExportNamedDeclaration, { srcFilePath, path, withTypes, ...bodyParams }: FnOptions, noDecorator: boolean): any[] | ExportNamedDeclaration;
export declare function transformClassExportBeforeDecorator(root: any): any[];
