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
            // console.log('yeah', JSON.stringify(program.body[0], null, 4));
            program.body[0] = transformInterface(program.body[0]);
            const { code } = generate(program as any);
            expect(code).toEqual(codeTranspiled);
        });
    });
});
