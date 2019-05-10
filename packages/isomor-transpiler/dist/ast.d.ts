export { default as generate } from '@babel/generator';
export { ExportNamedDeclaration, Statement, ImportDeclaration } from '@babel/types';
export declare function parse(code: string): import("@babel/types").File;
export declare function JsonAst(node: any): string;
