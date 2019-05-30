"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("./ast");
const code_1 = require("./code");
exports.codeTranspiledFunc = `export function getTime(...args: any) {
  return isomorRemote("path/to/file", "getTime", args);
}`;
exports.codeTranspiledFuncNoType = `export function getTime(...args) {
  return isomorRemote("path/to/file", "getTime", args);
}`;
exports.codeTranspiledArrowFunc = `export const getTime = (...args: any) => {
  return isomorRemote("path/to/file", "getTime", args);
};`;
exports.codeTranspiledArrowFuncNoType = `export const getTime = (...args) => {
  return isomorRemote("path/to/file", "getTime", args);
};`;
exports.codeTranspiledClass = `async getTime(...args: any) {
  return isomorRemote("path/to/file", "getTime", args, "CatsService");
}`;
describe('code', () => {
    const path = 'path/to/file';
    const fnName = 'getTime';
    const className = 'CatsService';
    const typeName = 'MyType';
    describe('code/getCodeMethod()', () => {
        it('should generate method for isomor', () => {
            const withType = true;
            const { code } = ast_1.generate(code_1.getCodeMethod(path, fnName, className, withType));
            expect(code).toEqual(exports.codeTranspiledClass);
        });
    });
    describe('code/getCodeConstructor()', () => {
        it('should generate constructor for isomor', () => {
            const withType = true;
            const { code } = ast_1.generate(code_1.getCodeConstructor(withType));
            expect(code).toEqual(`constructor(...args: any) {
  super();
}`);
        });
    });
    describe('code/getCodeImport()', () => {
        it('should generate inport for isomor', () => {
            const { code } = ast_1.generate(code_1.getCodeImport());
            expect(code).toEqual(`import { isomorRemote } from "isomor";`);
        });
    });
    describe('code/getCodeType()', () => {
        it('should generate type for isomor', () => {
            const { code } = ast_1.generate(code_1.getCodeType(typeName));
            expect(code).toEqual(`export type MyType = any;`);
        });
    });
    describe('code/getCodeFunc()', () => {
        it('should generate function for isomor', () => {
            const withType = true;
            const { code } = ast_1.generate(code_1.getCodeFunc(path, fnName, withType));
            expect(code).toEqual(exports.codeTranspiledFunc);
        });
        it('should generate function for isomor without type', () => {
            const withType = false;
            const { code } = ast_1.generate(code_1.getCodeFunc(path, fnName, withType));
            expect(code).toEqual(exports.codeTranspiledFuncNoType);
        });
    });
    describe('code/getCodeArrowFunc()', () => {
        it('should generate function for isomor', () => {
            const withType = true;
            const { code } = ast_1.generate(code_1.getCodeArrowFunc(path, fnName, withType));
            expect(code).toEqual(exports.codeTranspiledArrowFunc);
        });
        it('should generate function for isomor without type', () => {
            const withType = false;
            const { code } = ast_1.generate(code_1.getCodeArrowFunc(path, fnName, withType));
            expect(code).toEqual(exports.codeTranspiledArrowFuncNoType);
        });
    });
});
//# sourceMappingURL=code.test.js.map