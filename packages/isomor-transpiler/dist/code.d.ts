import { Statement } from './ast';
interface BodyRemote {
    path: string;
    pkgName: string;
    name: string;
    className?: string;
    httpBaseUrl: string;
    wsBaseUrl: string;
    wsReg?: RegExp;
}
export interface CodeFunc {
    withTypes: boolean;
    bodyParams: BodyRemote;
}
export declare function getCodeType(name: string): Statement;
export declare function getCodeImport(): Statement;
export declare function getCodeFunc({ bodyParams, withTypes, }: CodeFunc): Statement;
export declare function getCodeArrowFunc({ bodyParams, withTypes, }: CodeFunc): Statement;
export declare function getCodeMethod({ bodyParams, withTypes, }: CodeFunc): Statement;
export declare function getCodeConstructor(withTypes: boolean, withSuper?: boolean): Statement;
export {};
