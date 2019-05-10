"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generator_1 = require("@babel/generator");
exports.generate = generator_1.default;
const parser_1 = require("@babel/parser");
function parse(code) {
    return parser_1.parse(code, {
        sourceType: 'module',
        plugins: [
            'typescript',
        ],
    });
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