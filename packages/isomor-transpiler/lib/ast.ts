// what about ts.createSourceFile...

/*
* eslint + babel
*/

// export {
//     ExportNamedDeclaration, Statement, ImportDeclaration,
// } from '@typescript-eslint/typescript-estree/dist/ts-estree/ts-estree';
// import { parse as parseEstree } from '@typescript-eslint/typescript-estree';
// import generate from '@babel/generator';
// export { generate };

// export function parse(code: string) {
//     const program = parseEstree(code);
//     return { program };
// }

/*
* ts
*/
// import { createSourceFile, ScriptTarget } from 'typescript';
// export {
//     Statement, ImportDeclaration,
// } from 'typescript';
// import generate from '@babel/generator';
// export { generate };
// export type ExportNamedDeclaration = any;

// export function parse(code: string) {
//     const source = createSourceFile(
//         'file.ts',
//         code,
//         ScriptTarget.Latest,
//     );
//     console.log('source', JSON.stringify(source, null, 4));
//     process.exit();
// }

/*
* babel only
*/

import { transformSync } from '@babel/core';

import generate from '@babel/generator';
export { generate };

export { ExportNamedDeclaration, Statement, ImportDeclaration } from '@babel/types';

const config = {
    sourceType: 'unambiguous' as 'unambiguous',
    presets: [
        '@babel/env',
        // '@babel/typescript',
        // '@babel/preset-env',
        // '@babel/preset-typescript',
    ],
    plugins: [
        require('../dist/babel-ts.js'),
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
        // 'exportDefaultFrom',
    ],
    cwd: process.cwd(),
    filename: 'file.ts',
    filenameRelative: 'file.ts',
    sourceFileName: 'file.ts',
    babelrc: false,
    ast: true,
};

export function parse(code: string) {
    const { ast } = transformSync(code, config);
    return ast;
}

/*
* tools
*/

export function JsonAst(node: any) {
    const skip = ['loc', 'range'];
    const replacer = (key: string, value: any) => skip.includes(key) ? undefined : value;
    return JSON.stringify(node, replacer, 4);
}

if (process.env.TESTME === 'true') {
    // const node = parse(`export function getTime(...args: any) {
    //     return remote("path/to/file", "getTime", args);
    // }`);
    const node = parse(`
    export interface MyInterface2 {
        hello: string;
        foo: CpuInfo;
        bar: {
            child: CpuInfo;
        };
        world: CpuInfo[];
    }

    import { readdir } from 'fs-extra';
    import { CpuInfo } from 'os';
    import { something } from './my/import';

    export { CpuInfo } from 'os';
    export { Hello, Abc } from './my/import';

    export type MyType = string;
    export interface MyInterface {
        foo: CpuInfo;
        bar: {
            child: CpuInfo;
        };
    }

    export function getTime1(): Promise<string[]> {
        return readdir('./');
    }

    export async function getTime2(input: { foo: string }): Promise<string[]> {
        return readdir('./');
    }

    export const getTime3 = async (hello: string) => {
        return await readdir('./');
    };

    function shouldNotBeTranspiled() {
        console.log('hello');
    }

    export class PostAbc {
        @Length(10, 20)
        title: string;

        @Contains("hello")
        text: string;
    }

    export class Post implements IsomorShare {
        @Length(10, 20)
        title: string;

        @Contains("hello")
        text: string;
    }
    `);
    console.log('node', JsonAst(node));
    console.log('node', node);
}
