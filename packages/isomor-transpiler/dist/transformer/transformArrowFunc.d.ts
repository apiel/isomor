import { VariableDeclaration } from '../ast';
import { FnOptions } from 'lib/transformNode';
export declare function transformArrowFunc(root: VariableDeclaration, { srcFilePath, ...bodyParams }: FnOptions): void;
