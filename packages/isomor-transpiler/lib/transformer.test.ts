import generate from '@babel/generator';
import { parse } from '@typescript-eslint/typescript-estree';

import { transformInterface, transformImport, transformExport } from './transformer';
import { getCodeType } from './code';

const codeSourceInterface = `
export interface MyInterface {
    hello: string;
    foo: CpuInfo;
    bar: {
        child: CpuInfo;
    };
    world: CpuInfo[];
}`;

const codeTranspiledInterface =
    `export interface MyInterface {
  hello: string;
  foo: any;
  bar: {
    child: any;
  };
  world: any;
}`;

const transformToCode = (fn: any) => (source: string): string  => {
    const program = parse(source);
    // console.log('JsonAst', JsonAst(program.body[0]));
    program.body[0] = fn(program.body[0]);
    const { code } = generate(program as any);
    return code;
};

jest.mock('./code', () => ({
    getCodeType: jest.fn().mockReturnValue('getCodeTypeMock'),
}));

describe('transformer', () => {
    describe('transformInterface()', () => {
        const ttc = transformToCode(transformInterface);
        it('should transform props interface to any', () => {
            expect(ttc(codeSourceInterface)).toBe(codeTranspiledInterface);
        });
    });
    describe('transformImport()', () => {
        const ttc = transformToCode(transformImport);
        it('should transform import Literal to LiteralString', () => {
            expect(ttc(`import { readdir } from 'fs-extra';`)).toBe(`import { readdir } from "fs-extra";`);
        });
        it('should remove locale import', () => {
            expect(ttc(`import { something } from './my/import';`)).toBe('');
        });
    });
    describe('transformExport()', () => {
        const ttc = transformToCode(transformExport);
        it('should transform export Literal to LiteralString', () => {
            expect(ttc(`export { CpuInfo } from 'os';`)).toBe(`export { CpuInfo } from "os";`);
        });
        it('should transform locale export', () => {
            const program = parse(`export { CpuInfo, Abc } from './my/import';`);
            const node = transformExport(program.body[0]);
            expect(node).toEqual(['getCodeTypeMock', 'getCodeTypeMock']);
            expect(getCodeType).toHaveBeenCalledWith('CpuInfo');
            expect(getCodeType).toHaveBeenCalledWith('Abc');
        });
    });
});

export function JsonAst(node: any) {
    const skip = ['loc', 'range'];
    const replacer = (key: string, value: any) => skip.includes(key)  ? undefined : value;
    return JSON.stringify(node, replacer, 4);
}
