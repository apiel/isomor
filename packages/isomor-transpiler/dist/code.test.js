"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("@babel/generator");
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const code_1 = require("./code");
exports.isomorImport = `import { remote } from "isomor";`;
exports.codeTranspiledType = `export type MyType = any;`;
exports.codeTranspiledFunc = `export function getTime(...args: any) {
  return remote("path/to/file", "getTime", args);
}`;
exports.codeTranspiledFuncNoType = `export function getTime(...args) {
  return remote("path/to/file", "getTime", args);
}`;
exports.codeTranspiledArrowFunc = `export const getTime = (...args: any) => {
  return remote("path/to/file", "getTime", args);
};`;
exports.codeTranspiledArrowFuncNoType = `export const getTime = (...args) => {
  return remote("path/to/file", "getTime", args);
};`;
describe('code', () => {
    const path = 'path/to/file';
    const fnName = 'getTime';
    const typeName = 'MyType';
    describe('code/getCodeImport()', () => {
        it('should generate inport for isomor', () => {
            const program = typescript_estree_1.parse('');
            program.body = [code_1.getCodeImport()];
            const { code } = generator_1.default(program);
            expect(code).toEqual(exports.isomorImport);
        });
    });
    describe('code/getCodeType()', () => {
        it('should generate type for isomor', () => {
            const program = typescript_estree_1.parse('');
            program.body = [code_1.getCodeType(typeName)];
            const { code } = generator_1.default(program);
            expect(code).toEqual(exports.codeTranspiledType);
        });
    });
    describe('code/getCodeFunc()', () => {
        it('should generate function for isomor', () => {
            const withType = true;
            const program = typescript_estree_1.parse('');
            program.body = [code_1.getCodeFunc(path, fnName, withType)];
            const { code } = generator_1.default(program);
            expect(code).toEqual(exports.codeTranspiledFunc);
        });
        it('should generate function for isomor without type', () => {
            const withType = false;
            const program = typescript_estree_1.parse('');
            program.body = [code_1.getCodeFunc(path, fnName, withType)];
            const { code } = generator_1.default(program);
            expect(code).toEqual(exports.codeTranspiledFuncNoType);
        });
    });
    describe('code/getCodeArrowFunc()', () => {
        it('should generate function for isomor', () => {
            const withType = true;
            const program = typescript_estree_1.parse('');
            program.body = [code_1.getCodeArrowFunc(path, fnName, withType)];
            const { code } = generator_1.default(program);
            expect(code).toEqual(exports.codeTranspiledArrowFunc);
        });
        it('should generate function for isomor without type', () => {
            const withType = false;
            const program = typescript_estree_1.parse('');
            program.body = [code_1.getCodeArrowFunc(path, fnName, withType)];
            const { code } = generator_1.default(program);
            expect(code).toEqual(exports.codeTranspiledArrowFuncNoType);
        });
    });
});
//# sourceMappingURL=code.test.js.map