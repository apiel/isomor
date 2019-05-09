// what about ts.createSourceFile...

export {
    ExportNamedDeclaration, Statement, ImportDeclaration,
} from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
import { parse as parseEstree } from '@typescript-eslint/typescript-estree';
import generate from '@babel/generator';
export { generate };

export function parse(code: string) {
    const program = parseEstree(code);
    return { program };
}

// import { transformSync } from '@babel/core';

// import generate from '@babel/generator';
// export { generate };

// export { ExportNamedDeclaration, Statement, ImportDeclaration } from '@babel/types';

// const config = {
//     sourceType: 'unambiguous' as 'unambiguous',
//     presets: [
//         '@babel/env',
//         // '@babel/typescript',
//         // '@babel/preset-env',
//         '@babel/preset-typescript',
//     ],
//     plugins: [
//         [ '@babel/plugin-proposal-decorators', { legacy: true } ],
//         '@babel/proposal-class-properties',
//         '@babel/proposal-object-rest-spread',
//         // 'exportDefaultFrom',
//     ],
//     cwd: process.cwd(),
//     filename: 'file.ts',
//     filenameRelative: 'file.ts',
//     sourceFileName: 'file.ts',
//     babelrc: false,
//     ast: true,
// };

// export function parse(code: string) {
//     const { ast } = transformSync(code, config);
//     return ast;
// }

export function JsonAst(node: any) {
    const skip = ['loc', 'range'];
    const replacer = (key: string, value: any) => skip.includes(key) ? undefined : value;
    return JSON.stringify(node, replacer, 4);
}
