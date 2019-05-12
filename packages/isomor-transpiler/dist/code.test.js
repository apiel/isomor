"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("./ast");
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
exports.codeTranspiledClass = `export class CatsService {
  async getTime(...args: any) {
    return remote("path/to/file", "getTime", args, "CatsService");
  }

}`;
describe('code', () => {
    const path = 'path/to/file';
    const fnName = 'getTime';
    const className = 'CatsService';
    const typeName = 'MyType';
    describe('code/getCodeMethod()', () => {
        it('should generate function for isomor', () => {
            const withType = true;
            const { program } = ast_1.parse('export class CatsService {}');
            program.body[0].declaration.body.body = [code_1.getCodeMethod(path, fnName, className, withType)];
            const { code } = ast_1.generate(program);
            expect(code).toEqual(exports.codeTranspiledClass);
        });
    });
    describe('code/getCodeImport()', () => {
        it('should generate inport for isomor', () => {
            const { program } = ast_1.parse('');
            program.body = [code_1.getCodeImport()];
            const { code } = ast_1.generate(program);
            expect(code).toEqual(exports.isomorImport);
        });
    });
    describe('code/getCodeType()', () => {
        it('should generate type for isomor', () => {
            const { program } = ast_1.parse('');
            program.body = [code_1.getCodeType(typeName)];
            const { code } = ast_1.generate(program);
            expect(code).toEqual(exports.codeTranspiledType);
        });
    });
    describe('code/getCodeFunc()', () => {
        it('should generate function for isomor', () => {
            const withType = true;
            const { program } = ast_1.parse('');
            program.body = [code_1.getCodeFunc(path, fnName, withType)];
            const { code } = ast_1.generate(program);
            expect(code).toEqual(exports.codeTranspiledFunc);
        });
        it('should generate function for isomor without type', () => {
            const withType = false;
            const { program } = ast_1.parse('');
            program.body = [code_1.getCodeFunc(path, fnName, withType)];
            const { code } = ast_1.generate(program);
            expect(code).toEqual(exports.codeTranspiledFuncNoType);
        });
    });
    describe('code/getCodeArrowFunc()', () => {
        it('should generate function for isomor', () => {
            const withType = true;
            const { program } = ast_1.parse('');
            program.body = [code_1.getCodeArrowFunc(path, fnName, withType)];
            const { code } = ast_1.generate(program);
            expect(code).toEqual(exports.codeTranspiledArrowFunc);
        });
        it('should generate function for isomor without type', () => {
            const withType = false;
            const { program } = ast_1.parse('');
            program.body = [code_1.getCodeArrowFunc(path, fnName, withType)];
            const { code } = ast_1.generate(program);
            expect(code).toEqual(exports.codeTranspiledArrowFuncNoType);
        });
    });
});
//# sourceMappingURL=code.test.js.map