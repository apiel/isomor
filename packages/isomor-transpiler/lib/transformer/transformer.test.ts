import { parse, generate } from '../ast';

import { transformInterface, transformExport } from './transformer';
import { getCodeType } from '../code';
import { JsonAst } from '../ast';
import { isArray } from 'util';

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

const transformToCode = (fn: any) => (source: string, ...params: any[]): string => {
    const { program } = parse(source);
    // console.log('JsonAst', JsonAst(program.body[0]));
    const body = fn(program.body[0], ...params);
    program.body = isArray(body) ? body : [body];
    // console.log('JsonAst2', JsonAst(program.body[0]));
    const { code } = generate(program as any);
    return code;
};

jest.mock('../code', () => ({
    getCodeType: jest.fn().mockReturnValue('getCodeTypeMock'),
    getCodeMethod: jest.fn().mockReturnValue({
        type: 'ClassMethod',
        key: {
            type: 'Identifier',
            name: 'mock',
        },
        params: [],
    }),
    getCodeConstructor: jest.fn().mockReturnValue({
        type: 'ClassMethod',
        key: {
            type: 'Identifier',
            name: 'constructorMock',
        },
        params: [],
    }),
}));

describe('transformer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('transformInterface()', () => {
        const ttc = transformToCode(transformInterface);
        it('should transform props interface to any', () => {
            expect(ttc(codeSourceInterface)).toBe(codeTranspiledInterface);
        });
    });
    describe('transformExport()', () => {
        const ttc = transformToCode(transformExport);
        it('should transform keep export', () => {
            expect(ttc(`export { CpuInfo } from 'os';`)).toBe(`export { CpuInfo } from 'os';`);
        });
        it('should transform locale export', () => {
            const { program } = parse(`export { CpuInfo, Abc } from './my/import';`);
            const node = transformExport(program.body[0] as any);
            expect(node).toEqual(['getCodeTypeMock', 'getCodeTypeMock']);
            expect(getCodeType).toHaveBeenCalledWith('CpuInfo');
            expect(getCodeType).toHaveBeenCalledWith('Abc');
        });
        it('should transform export to any if noServerImport=true', () => {
            const noServerImport = true;
            const { program } = parse(`export { CpuInfo, Abc } from 'os';`);
            const node = transformExport(program.body[0] as any, noServerImport);
            expect(node).toEqual(['getCodeTypeMock', 'getCodeTypeMock']);
            expect(getCodeType).toHaveBeenCalledWith('CpuInfo');
            expect(getCodeType).toHaveBeenCalledWith('Abc');
        });
    });
});