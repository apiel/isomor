"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("@babel/generator");
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const transformer_1 = require("./transformer");
const codeSource = `
export interface MyInterface {
    hello: string;
    foo: CpuInfo;
    bar: {
        child: CpuInfo;
    };
    world: CpuInfo[];
}`;
const codeTranspiled = `export interface MyInterface {
  hello: string;
  foo: any;
  bar: {
    child: any;
  };
  world: any;
}`;
describe('transformer', () => {
    describe('transformInterface()', () => {
        it('should transform props interface to any', () => {
            const program = typescript_estree_1.parse(codeSource);
            program.body[0] = transformer_1.transformInterface(program.body[0]);
            const { code } = generator_1.default(program);
            expect(code).toEqual(codeTranspiled);
        });
    });
});
//# sourceMappingURL=transformer.test.js.map