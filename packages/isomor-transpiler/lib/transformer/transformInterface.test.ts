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
    noServerImport: boolean,
): string => {
    const { program } = parse(source);
    const body = transformInterface(program.body[0] as any, noServerImport);
    program.body = isArray(body) ? body : [body];
    const { code } = generate(program as any);
    return code;
};

describe('transformInterface()', () => {
    it('should keep interface as it is if noServerImport is false', () => {
        expect(transformInterfaceFromCode(codeSourceInterface, false)).toBe(codeSourceInterface);
    });
    it('should transform props interface to any if noServerImport is true', () => {
        expect(transformInterfaceFromCode(codeSourceInterface, true)).toBe(codeTranspiledInterface);
    });
});
