import { FnOptions } from '../transformNode';
import { FunctionDeclaration, Statement } from '../ast';
export declare function transformDefaultFunc(root: FunctionDeclaration, { srcFilePath, declaration, ...bodyParams }: FnOptions): Statement;
