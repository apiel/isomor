import generate from '@babel/generator';
import { parse } from '@typescript-eslint/typescript-estree';

import { getCodeImport, getCodeFunc, getCodeArrowFunc, getCodeType } from './code';

export const isomorImport = `import { remote } from "isomor";`;

export const codeTranspiledType = `export type MyType = any;`;

export const codeTranspiledFunc =
`export function getTime(...args: any) {
  return remote("path/to/file", "getTime", args);
}`;

export const codeTranspiledFuncNoType =
`export function getTime(...args) {
  return remote("path/to/file", "getTime", args);
}`;

export const codeTranspiledArrowFunc =
`export const getTime = (...args: any) => {
  return remote("path/to/file", "getTime", args);
};`;

export const codeTranspiledArrowFuncNoType =
`export const getTime = (...args) => {
  return remote("path/to/file", "getTime", args);
};`;

describe('code', () => {
    const path = 'path/to/file';
    const fnName = 'getTime';
    const typeName = 'MyType';

    describe('code/getCodeImport()', () => {
        it('should generate inport for isomor', () => {
            const program = parse('');
            program.body = [getCodeImport()];
            const { code } = generate(program as any);
            expect(code).toEqual(isomorImport);
        });
    });

    describe('code/getCodeType()', () => {
        it('should generate type for isomor', () => {
            const program = parse('');
            program.body = [getCodeType(typeName)];
            const { code } = generate(program as any);
            expect(code).toEqual(codeTranspiledType);
        });
    });

    describe('code/getCodeFunc()', () => {
        it('should generate function for isomor', () => {
            const withType = true;
            const program = parse('');
            program.body = [getCodeFunc(path, fnName, withType)];
            const { code } = generate(program as any);
            expect(code).toEqual(codeTranspiledFunc);
        });

        it('should generate function for isomor without type', () => {
            const withType = false;
            const program = parse('');
            program.body = [getCodeFunc(path, fnName, withType)];
            const { code } = generate(program as any);
            expect(code).toEqual(codeTranspiledFuncNoType);
        });
    });

    describe('code/getCodeArrowFunc()', () => {
        it('should generate function for isomor', () => {
            const withType = true;
            const program = parse('');
            program.body = [getCodeArrowFunc(path, fnName, withType)];
            const { code } = generate(program as any);
            expect(code).toEqual(codeTranspiledArrowFunc);
        });

        it('should generate function for isomor without type', () => {
            const withType = false;
            const program = parse('');
            program.body = [getCodeArrowFunc(path, fnName, withType)];
            const { code } = generate(program as any);
            expect(code).toEqual(codeTranspiledArrowFuncNoType);
        });
    });
});
