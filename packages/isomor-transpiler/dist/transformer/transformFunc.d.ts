import { FunctionDeclaration } from '../ast';
import { FnOptions } from 'lib/transformNode';
export declare function transformFunc(root: FunctionDeclaration, { srcFilePath, path, withTypes, ...bodyParams }: FnOptions): import("@babel/types").Statement;
