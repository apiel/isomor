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
    ast.program.body.splice(0, 1);
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
    `);
    console.log('node', JsonAst(node));
    console.log('node', node);
}
//# sourceMappingURL=ast.js.map