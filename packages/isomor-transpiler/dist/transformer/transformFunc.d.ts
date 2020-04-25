import { FunctionDeclaration, Statement } from '../ast';
import { FnOptions } from 'lib/transformNode';
export declare function transformFunc(root: FunctionDeclaration, { srcFilePath, path, withTypes, ...bodyParams }: FnOptions): Statement;
