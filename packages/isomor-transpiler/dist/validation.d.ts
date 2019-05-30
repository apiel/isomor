import { FunctionDeclaration, ClassMethod, ArrowFunctionExpression } from './ast';
declare type RootParams = FunctionDeclaration | ClassMethod | ArrowFunctionExpression;
export interface ValidationSchema {
    args: string[];
    schema: any;
}
export declare function setValidator(paramRoot: RootParams, srcFilePath: string, path: string, name: string, className?: string): string[];
export declare function pushToQueue(args: string[], srcFilePath: string, path: string, name: string, className: string | undefined): void;
export {};
