import { parse, generate } from './ast';

import { transformInterface, transformImport, transformExport, transformClass } from './transformer';
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

const transformToCode = (fn: any) => (source: string): string => {
    const { program } = parse(source);
    // console.log('JsonAst', JsonAst(program.body[0]));
    program.body[0] = fn(program.body[0]);
    const { code } = generate(program as any);
    return code;
};

jest.mock('./code', () => ({
    getCodeType: jest.fn().mockReturnValue('getCodeTypeMock'),
    getCodeMethod: jest.fn().mockReturnValue({
        type: 'ClassMethod',
        key: {
            type: 'Identifier',
            name: 'mock',
        },
        params: [],
    }),
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
        it('should transform keep import', () => {
            expect(ttc(`import { readdir } from 'fs-extra';`)).toBe(`import { readdir } from 'fs-extra';`);
        });
        it('should remove locale import', () => {
            expect(ttc(`import { something } from './my/import';`)).toBe('');
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
    describe('transformClass()', () => {
        const ttc = transformToCode(transformClass);
        it('should keep class when implement IsomorShare', () => {
            const code =
`export class Post implements IsomorShare {
  @Length(10, 20)
  title: string;
  @Contains("hello")
  text: string;
}`;
            expect(ttc(code)).toBe(code);
        });
        it('should remove class when no IsomorShare implementation', () => {
            const code =
`@Injectable()
export class CatsService {
  findAll(id: string): Cat[] {
    return this.cats;
  }

}`;
            expect(ttc(code)).toBe(
`export @Injectable()
class CatsService {
  mock()

}`,
            );
        });
    });
});
