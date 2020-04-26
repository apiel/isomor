import { Statement } from './ast';
export interface FnOptions {
    srcFilePath: string;
    path: string;
    pkgName: string;
    withTypes: boolean;
    httpBaseUrl: string;
    wsBaseUrl: string;
    wsReg?: RegExp;
}
export declare function transformNode(node: Statement, fnOptions: FnOptions, noServerImport: boolean, noDecorator: boolean): Statement;
