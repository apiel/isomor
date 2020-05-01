import { Statement } from './ast';
export interface FnOptions {
    srcFilePath: string;
    moduleName: string;
    declaration: boolean;
    httpBaseUrl: string;
    wsBaseUrl: string;
    wsReg?: RegExp;
}
export declare function transformNode(node: Statement, fnOptions: FnOptions): Statement;
