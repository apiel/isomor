import { VariableDeclaration } from '../ast';
import { FnOptions } from 'lib/transformNode';
export declare function transformArrowFunc(root: VariableDeclaration, { srcFilePath, path, withTypes, ...bodyParams }: FnOptions): import("@babel/types").Statement;
