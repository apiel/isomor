import { ImportDeclaration } from '../ast';
export declare function transformImport(root: ImportDeclaration, noServerImport: boolean): ImportDeclaration | import("@babel/types").Statement[];
