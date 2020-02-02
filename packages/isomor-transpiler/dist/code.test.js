"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("./ast");
const code_1 = require("./code");
exports.codeTranspiledFunc = `export function getTime(...args: any) {
  return isomorRemote("http", "path/to/file", "root", "getTime", args);
}`;
exports.codeTranspiledFuncForWs = `export function getTime(...args: any) {
  return isomorRemote("ws", "path/to/file", "root", "getTime", args);
}`;
exports.codeTranspiledFuncNoType = `export function getTime(...args) {
  return isomorRemote("http", "path/to/file", "root", "getTime", args);
}`;
exports.codeTranspiledArrowFunc = `export const getTime = (...args: any) => {
  return isomorRemote("http", "path/to/file", "root", "getTime", args);
};`;
exports.codeTranspiledArrowFuncNoType = `export const getTime = (...args) => {
  return isomorRemote("http", "path/to/file", "root", "getTime", args);
};`;
exports.codeTranspiledClass = `async getTime(...args: any) {
  return isomorRemote("http", "path/to/file", "root", "getTime", args, "CatsService");
}`;
describe('code', () => {
    const path = 'path/to/file';
    const name = 'getTime';
    const className = 'CatsService';
    const typeName = 'MyType';
    const pkgName = 'root';
    const wsReg = null;
    describe('code/getCodeMethod()', () => {
        it('should generate method for isomor', () => {
            const withTypes = true;
            const { code } = ast_1.generate(code_1.getCodeMethod({ bodyParams: { wsReg, path, pkgName, className, name }, withTypes }));
            expect(code).toEqual(exports.codeTranspiledClass);
        });
    });
    describe('code/getCodeConstructor()', () => {
        it('should generate constructor for isomor', () => {
            const withTypes = true;
            const { code } = ast_1.generate(code_1.getCodeConstructor(withTypes));
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
            const withTypes = true;
            const { code } = ast_1.generate(code_1.getCodeFunc({ bodyParams: { wsReg, path, pkgName, name }, withTypes }));
            expect(code).toEqual(exports.codeTranspiledFunc);
        });
        it('should generate function for isomor without type', () => {
            const withTypes = false;
            const { code } = ast_1.generate(code_1.getCodeFunc({ bodyParams: { wsReg, path, pkgName, name }, withTypes }));
            expect(code).toEqual(exports.codeTranspiledFuncNoType);
        });
        it('should generate function for isomor with websocket', () => {
            const withTypes = true;
            const websocketReg = new RegExp('.*');
            const { code } = ast_1.generate(code_1.getCodeFunc({ bodyParams: { wsReg: websocketReg, path, pkgName, name }, withTypes }));
            expect(code).toEqual(exports.codeTranspiledFuncForWs);
        });
        it('should generate function for isomor with websocket for function name', () => {
            const withTypes = true;
            const websocketReg = new RegExp('getTime');
            const { code } = ast_1.generate(code_1.getCodeFunc({ bodyParams: { wsReg: websocketReg, path, pkgName, name }, withTypes }));
            expect(code).toEqual(exports.codeTranspiledFuncForWs);
        });
        it('should generate function for isomor with http since ws regex doesnt match', () => {
            const withTypes = true;
            const websocketReg = new RegExp('getTimes');
            const { code } = ast_1.generate(code_1.getCodeFunc({ bodyParams: { wsReg: websocketReg, path, pkgName, name }, withTypes }));
            expect(code).toEqual(exports.codeTranspiledFunc);
        });
    });
    describe('code/getCodeArrowFunc()', () => {
        it('should generate function for isomor', () => {
            const withTypes = true;
            const { code } = ast_1.generate(code_1.getCodeArrowFunc({ bodyParams: { wsReg, path, pkgName, name }, withTypes }));
            expect(code).toEqual(exports.codeTranspiledArrowFunc);
        });
        it('should generate function for isomor without type', () => {
            const withTypes = false;
            const { code } = ast_1.generate(code_1.getCodeArrowFunc({ bodyParams: { wsReg, path, pkgName, name }, withTypes }));
            expect(code).toEqual(exports.codeTranspiledArrowFuncNoType);
        });
    });
});
//# sourceMappingURL=code.test.js.map