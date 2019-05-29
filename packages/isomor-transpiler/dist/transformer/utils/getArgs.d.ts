import { FunctionDeclaration, ClassMethod, ArrowFunctionExpression } from '../../ast';
declare type RootParams = FunctionDeclaration | ClassMethod | ArrowFunctionExpression;
export declare function getArgs(paramRoot: RootParams, srcFilePath: string, path: string, name: string, className?: string): string[];
export {};
