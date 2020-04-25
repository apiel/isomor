import { parse, generate, JsonAst } from './ast';

import { getCodeImport, getCodeFunc, getCodeArrowFunc, getCodeType } from './code';

export const codeTranspiledFunc =
    `export function getTime(...args: any) {
  return isomorRemote("http", "", "path/to/file", "root", "getTime", args);
}`;

export const codeTranspiledFuncForWs =
    `export function getTime(...args: any) {
  return isomorRemote("ws", "ws://127.0.0.1:3005", "path/to/file", "root", "getTime", args);
}`;

export const codeTranspiledFuncNoType =
    `export function getTime(...args) {
  return isomorRemote("http", "", "path/to/file", "root", "getTime", args);
}`;

export const codeTranspiledArrowFunc =
    `export const getTime = (...args: any) => {
  return isomorRemote("http", "", "path/to/file", "root", "getTime", args);
};`;

export const codeTranspiledArrowFuncNoType =
    `export const getTime = (...args) => {
  return isomorRemote("http", "", "path/to/file", "root", "getTime", args);
};`;

export const codeTranspiledClass =
    `async getTime(...args: any) {
  return isomorRemote("http", "", "path/to/file", "root", "getTime", args, "CatsService");
}`;

describe('code', () => {
    const path = 'path/to/file';
    const name = 'getTime';
    const typeName = 'MyType';
    const pkgName = 'root';
    const wsReg = null;
    const httpBaseUrl = '';
    const wsBaseUrl = 'ws://127.0.0.1:3005';

    const bodyParams = { wsReg, path, pkgName, name, httpBaseUrl, wsBaseUrl };

    describe('code/getCodeImport()', () => {
        it('should generate inport for isomor', () => {
            const { code } = generate(getCodeImport() as any);
            expect(code).toEqual(`import { isomorRemote } from "isomor";`);
        });
    });

    describe('code/getCodeType()', () => {
        it('should generate type for isomor', () => {
            const { code } = generate(getCodeType(typeName) as any);
            expect(code).toEqual(`export type MyType = any;`);
        });
    });

    describe('code/getCodeFunc()', () => {
        it('should generate function for isomor', () => {
            const withTypes = true;
            const { code } = generate(getCodeFunc({ bodyParams, withTypes }) as any);
            expect(code).toEqual(codeTranspiledFunc);
        });

        it('should generate function for isomor without type', () => {
            const withTypes = false;
            const { code } = generate(getCodeFunc({ bodyParams, withTypes }) as any);
            expect(code).toEqual(codeTranspiledFuncNoType);
        });

        it('should generate function for isomor with websocket', () => {
            const withTypes = true;
            const websocketReg = new RegExp('.*');
            const { code } = generate(getCodeFunc({ bodyParams: { ...bodyParams, wsReg: websocketReg }, withTypes }) as any);
            expect(code).toEqual(codeTranspiledFuncForWs);
        });

        it('should generate function for isomor with websocket for function name', () => {
            const withTypes = true;
            const websocketReg = new RegExp('getTime');
            const { code } = generate(getCodeFunc({ bodyParams: { ...bodyParams, wsReg: websocketReg }, withTypes }) as any);
            expect(code).toEqual(codeTranspiledFuncForWs);
        });

        it('should generate function for isomor with http since ws regex doesnt match', () => {
            const withTypes = true;
            const websocketReg = new RegExp('getTimes');
            const { code } = generate(getCodeFunc({ bodyParams: { ...bodyParams, wsReg: websocketReg }, withTypes }) as any);
            expect(code).toEqual(codeTranspiledFunc);
        });
    });

    describe('code/getCodeArrowFunc()', () => {
        it('should generate function for isomor', () => {
            const withTypes = true;
            const { code } = generate(getCodeArrowFunc({ bodyParams, withTypes }) as any);
            expect(code).toEqual(codeTranspiledArrowFunc);
        });

        it('should generate function for isomor without type', () => {
            const withTypes = false;
            const { code } = generate(getCodeArrowFunc({ bodyParams, withTypes }) as any);
            expect(code).toEqual(codeTranspiledArrowFuncNoType);
        });
    });
});
