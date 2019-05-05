import { TSESTree } from '@typescript-eslint/typescript-estree';
export declare function getCodeType(name: string): TSESTree.Statement;
export declare function getCodeImport(): TSESTree.Statement;
export declare function getCodeFunc(fileName: string, name: string, withTypes: boolean): TSESTree.Statement;
export declare function getCodeArrowFunc(fileName: string, name: string, withTypes: boolean): TSESTree.Statement;
