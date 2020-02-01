import { FunctionDeclaration } from '../ast';
export declare function transformFunc(root: FunctionDeclaration, srcFilePath: string, wsReg: RegExp | null, path: string, pkgName: string, withTypes: boolean): import("@babel/types").Statement;
