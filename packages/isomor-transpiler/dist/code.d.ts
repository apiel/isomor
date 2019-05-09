import { Statement } from './ast';
export declare function getCodeType(name: string): Statement;
export declare function getCodeImport(): Statement;
export declare function getCodeFunc(fileName: string, name: string, withTypes: boolean): Statement;
export declare function getCodeArrowFunc(fileName: string, name: string, withTypes: boolean): Statement;
