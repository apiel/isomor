"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("./ast");
const code_1 = require("./code");
exports.codeTranspiledFunc = `export function getTime(...args: any) {
  return isomorRemote("http", "", "path/to/file", "root", "getTime", args);
}`;
exports.codeTranspiledFuncForWs = `export function getTime(...args: any) {
  return isomorRemote("ws", "ws://127.0.0.1:3005", "path/to/file", "root", "getTime", args);
}`;
exports.codeTranspiledFuncNoType = `export function getTime(...args) {
  return isomorRemote("http", "", "path/to/file", "root", "getTime", args);
}`;
exports.codeTranspiledArrowFunc = `export const getTime = (...args: any) => {
  return isomorRemote("http", "", "path/to/file", "root", "getTime", args);
};`;
exports.codeTranspiledArrowFuncNoType = `export const getTime = (...args) => {
  return isomorRemote("http", "", "path/to/file", "root", "getTime", args);
};`;
exports.codeTranspiledClass = `async getTime(...args: any) {
  return isomorRemote("http", "", "path/to/file", "root", "getTime", args, "CatsService");
}`;
describe('code', () => {
    const path = 'path/to/file';
    const name = 'getTime';
    const typeName = 'MyType';
    const moduleName = 'root';
    const wsReg = null;
    const httpBaseUrl = '';
    const wsBaseUrl = 'ws://127.0.0.1:3005';
    const bodyParams = { wsReg, path, moduleName, name, httpBaseUrl, wsBaseUrl };
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
            const { code } = ast_1.generate(code_1.getCodeFunc({ bodyParams }));
            expect(code).toEqual(exports.codeTranspiledFunc);
        });
        it('should generate function for isomor without type', () => {
            const { code } = ast_1.generate(code_1.getCodeFunc({ bodyParams }));
            expect(code).toEqual(exports.codeTranspiledFuncNoType);
        });
        it('should generate function for isomor with websocket', () => {
            const websocketReg = new RegExp('.*');
            const { code } = ast_1.generate(code_1.getCodeFunc({ bodyParams: Object.assign(Object.assign({}, bodyParams), { wsReg: websocketReg }) }));
            expect(code).toEqual(exports.codeTranspiledFuncForWs);
        });
        it('should generate function for isomor with websocket for function name', () => {
            const websocketReg = new RegExp('getTime');
            const { code } = ast_1.generate(code_1.getCodeFunc({ bodyParams: Object.assign(Object.assign({}, bodyParams), { wsReg: websocketReg }) }));
            expect(code).toEqual(exports.codeTranspiledFuncForWs);
        });
        it('should generate function for isomor with http since ws regex doesnt match', () => {
            const websocketReg = new RegExp('getTimes');
            const { code } = ast_1.generate(code_1.getCodeFunc({ bodyParams: Object.assign(Object.assign({}, bodyParams), { wsReg: websocketReg }) }));
            expect(code).toEqual(exports.codeTranspiledFunc);
        });
    });
    describe('code/getCodeArrowFunc()', () => {
        it('should generate function for isomor', () => {
            const { code } = ast_1.generate(code_1.getCodeArrowFunc({ bodyParams }));
            expect(code).toEqual(exports.codeTranspiledArrowFunc);
        });
        it('should generate function for isomor without type', () => {
            const { code } = ast_1.generate(code_1.getCodeArrowFunc({ bodyParams }));
            expect(code).toEqual(exports.codeTranspiledArrowFuncNoType);
        });
    });
});
//# sourceMappingURL=code.test.js.map