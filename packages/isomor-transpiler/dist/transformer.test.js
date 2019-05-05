"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("@babel/generator");
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const transformer_1 = require("./transformer");
const code_1 = require("./code");
const codeSourceInterface = `
export interface MyInterface {
    hello: string;
    foo: CpuInfo;
    bar: {
        child: CpuInfo;
    };
    world: CpuInfo[];
}`;
const codeTranspiledInterface = `export interface MyInterface {
  hello: string;
  foo: any;
  bar: {
    child: any;
  };
  world: any;
}`;
const transformToCode = (fn) => (source) => {
    const program = typescript_estree_1.parse(source);
    program.body[0] = fn(program.body[0]);
    const { code } = generator_1.default(program);
    return code;
};
jest.mock('./code', () => ({
    getCodeType: jest.fn().mockReturnValue('getCodeTypeMock'),
}));
describe('transformer', () => {
    describe('transformInterface()', () => {
        const ttc = transformToCode(transformer_1.transformInterface);
        it('should transform props interface to any', () => {
            expect(ttc(codeSourceInterface)).toBe(codeTranspiledInterface);
        });
    });
    describe('transformImport()', () => {
        const ttc = transformToCode(transformer_1.transformImport);
        it('should transform import Literal to LiteralString', () => {
            expect(ttc(`import { readdir } from 'fs-extra';`)).toBe(`import { readdir } from "fs-extra";`);
        });
        it('should remove locale import', () => {
            expect(ttc(`import { something } from './my/import';`)).toBe('');
        });
    });
    describe('transformExport()', () => {
        const ttc = transformToCode(transformer_1.transformExport);
        it('should transform export Literal to LiteralString', () => {
            expect(ttc(`export { CpuInfo } from 'os';`)).toBe(`export { CpuInfo } from "os";`);
        });
        it('should transform locale export', () => {
            const program = typescript_estree_1.parse(`export { CpuInfo, Abc } from './my/import';`);
            const node = transformer_1.transformExport(program.body[0]);
            expect(node).toEqual(['getCodeTypeMock', 'getCodeTypeMock']);
            expect(code_1.getCodeType).toHaveBeenCalledWith('CpuInfo');
            expect(code_1.getCodeType).toHaveBeenCalledWith('Abc');
        });
        it('should transform export to any if noServerImport=true', () => {
            const noServerImport = true;
            const program = typescript_estree_1.parse(`export { CpuInfo, Abc } from 'os';`);
            const node = transformer_1.transformExport(program.body[0], noServerImport);
            expect(node).toEqual(['getCodeTypeMock', 'getCodeTypeMock']);
            expect(code_1.getCodeType).toHaveBeenCalledWith('CpuInfo');
            expect(code_1.getCodeType).toHaveBeenCalledWith('Abc');
        });
    });
});
function JsonAst(node) {
    const skip = ['loc', 'range'];
    const replacer = (key, value) => skip.includes(key) ? undefined : value;
    return JSON.stringify(node, replacer, 4);
}
exports.JsonAst = JsonAst;
//# sourceMappingURL=transformer.test.js.map