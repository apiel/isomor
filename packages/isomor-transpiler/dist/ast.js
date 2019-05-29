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
            'decorators-legacy',
        ],
    });
}
exports.parse = parse;
function JsonAst(node) {
    const skip = ['loc', 'range', 'start', 'end'];
    const replacer = (key, value) => skip.includes(key) ? undefined : value;
    return JSON.stringify(node, replacer, 4);
}
exports.JsonAst = JsonAst;
if (process.env.TEST_AST) {
    const result = (node) => {
        console.log('node', JsonAst(node));
        console.log('node', node);
    };
    if (['interface', 'all'].includes(process.env.TEST_AST)) {
        const node = parse(`
            export interface MyInterface2 {
                hello: string;
                foo: CpuInfo;
            }
        `);
        result(node);
    }
    else if (['class', 'all'].includes(process.env.TEST_AST)) {
        const node = parse(`
            export class Post implements IsomorShare {
                @Length(10, 20)
                title: string;

                @Contains("hello")
                text: string;
            }
        `);
        result(node);
    }
    else if (['argsObject', 'all'].includes(process.env.TEST_AST)) {
        const node = parse(`
            const [input1, input2] = args;
            const argsObject = { input1, input2 };
        `);
        result(node);
    }
}
//# sourceMappingURL=ast.js.map