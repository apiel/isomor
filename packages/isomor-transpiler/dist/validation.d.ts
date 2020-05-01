import { FunctionDeclaration, ArrowFunctionExpression } from './__deprecated/ast';
declare type RootParams = FunctionDeclaration | ArrowFunctionExpression;
export declare function setValidator(paramRoot: RootParams, srcFilePath: string, path: string, name: string): any[];
export declare function pushToQueue(args: string[], srcFilePath: string, path: string, name: string): void;
export {};
