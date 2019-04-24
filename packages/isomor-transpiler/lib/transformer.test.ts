import generate from '@babel/generator';
import { parse } from '@typescript-eslint/typescript-estree';

import { transformInterface } from './transformer';

const codeSource = `
export interface MyInterface {
    hello: string;
    foo: CpuInfo;
    bar: {
        child: CpuInfo;
    };
    world: CpuInfo[];
}`;

const codeTranspiled =
    `export interface MyInterface {
  hello: string;
  foo: any;
  bar: {
    child: any;
  };
  world: any;
}`;

describe('transformer', () => {
    describe('transformInterface()', () => {
        it('should transform props interface to any', () => {
            const program = parse(codeSource);
            // console.log('JsonAst', JsonAst(program.body[0]));
            program.body[0] = transformInterface(program.body[0]);
            const { code } = generate(program as any);
            expect(code).toEqual(codeTranspiled);
        });
    });
});

export function JsonAst(node: any) {
    const skip = ['loc', 'range'];
    const replacer = (key: string, value: any) => skip.includes(key)  ? undefined : value;
    return JSON.stringify(node, replacer, 4);
}
