import generate from '@babel/generator';
import { parse } from '@typescript-eslint/typescript-estree';

import { transformInterface, transformImport } from './transformer';

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
});

export function JsonAst(node: any) {
    const skip = ['loc', 'range'];
    const replacer = (key: string, value: any) => skip.includes(key)  ? undefined : value;
    return JSON.stringify(node, replacer, 4);
}
