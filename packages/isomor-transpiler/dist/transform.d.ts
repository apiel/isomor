import { TSESTree } from '@typescript-eslint/typescript-estree';
export default function transform(body: TSESTree.Statement[], fileName: string, withTypes?: boolean): TSESTree.Statement[];
