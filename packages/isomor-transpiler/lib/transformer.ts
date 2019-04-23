import { TSESTree } from '@typescript-eslint/typescript-estree';
import * as traverse from 'traverse';
// might have a look again at https://www.npmjs.com/package/esrecurse

// Need test
// const codeSource = `
// export interface MyInterface {
//     hello: string;
//     foo: CpuInfo;
//     bar: {
//         child: CpuInfo;
//     };
// }
// `;
// + export interface MyInterface {
//     +   hello: string;
//     +   foo: any;
//     +   bar: {
//     +     child: any;
//     +   };
//     + }


export function transformInterface(root: TSESTree.Statement) {
    traverse(root).forEach(function(node: any) {
        if (node && node.type === 'TSTypeAnnotation' && node.typeAnnotation.type === 'TSTypeReference') {
            node.typeAnnotation = {
                type: 'TSAnyKeyword',
            };
            this.update(node);
        }
    });
    return root;
}
