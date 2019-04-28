import { TSESTree } from '@typescript-eslint/typescript-estree';
export default function transform(body: TSESTree.Statement[], path: string, withTypes?: boolean, noServerImport?: boolean): TSESTree.Statement[];
