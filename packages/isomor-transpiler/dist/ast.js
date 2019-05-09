"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@babel/core");
const generator_1 = require("@babel/generator");
exports.generate = generator_1.default;
const config = {
    sourceType: 'unambiguous',
    presets: [
        '@babel/env',
    ],
    plugins: [
        require('../dist/babel-ts.js'),
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
    ],
    cwd: process.cwd(),
    filename: 'file.ts',
    filenameRelative: 'file.ts',
    sourceFileName: 'file.ts',
    babelrc: false,
    ast: true,
};
function parse(code) {
    const { ast } = core_1.transformSync(code, config);
    return ast;
}
exports.parse = parse;
function JsonAst(node) {
    const skip = ['loc', 'range'];
    const replacer = (key, value) => skip.includes(key) ? undefined : value;
    return JSON.stringify(node, replacer, 4);
}
exports.JsonAst = JsonAst;
if (process.env.TESTME === 'true') {
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
//# sourceMappingURL=ast.js.map