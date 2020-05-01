import { parse, generate } from '../ast';

import { transformInterface } from './transformInterface';
import { isArray } from 'util';

const codeSourceInterface =
    `export interface MyInterface {
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

const transformInterfaceFromCode = (
    source: string,
): string => {
    const { program } = parse(source);
    const body = transformInterface(program.body[0] as any);
    program.body = isArray(body) ? body : [body];
    const { code } = generate(program as any);
    return code;
};

// ToDo fix
describe('transformInterface()', () => {
    it('should transform props interface to any', () => {
        expect(transformInterfaceFromCode(codeSourceInterface)).toBe(codeTranspiledInterface);
    });
});
