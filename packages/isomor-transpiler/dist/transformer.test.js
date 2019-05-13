"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("./ast");
const transformer_1 = require("./transformer");
const code_1 = require("./code");
const util_1 = require("util");
const codeSourceInterface = `
export interface MyInterface {
    hello: string;
    foo: CpuInfo;
    bar: {
        child: CpuInfo;
    };
    world: CpuInfo[];
}`;
const codeTranspiledInterface = `export interface MyInterface {
  hello: string;
  foo: any;
  bar: {
    child: any;
  };
  world: any;
}`;
const transformToCode = (fn) => (source, ...params) => {
    const { program } = ast_1.parse(source);
    const body = fn(program.body[0], ...params);
    program.body = util_1.isArray(body) ? body : [body];
    const { code } = ast_1.generate(program);
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
    describe('transformInterface()', () => {
        const ttc = transformToCode(transformer_1.transformInterface);
        it('should transform props interface to any', () => {
            expect(ttc(codeSourceInterface)).toBe(codeTranspiledInterface);
        });
    });
    describe('transformImport()', () => {
        const ttc = transformToCode(transformer_1.transformImport);
        it('should keep import', () => {
            expect(ttc(`import { readdir } from 'fs-extra';`)).toBe(`import { readdir } from 'fs-extra';`);
        });
        it('should remove import', () => {
            const noServerImport = true;
            expect(ttc(`import { readdir } from 'fs-extra';`, noServerImport)).toBe(``);
        });
        it('should transform server import to browser import', () => {
            expect(ttc(`import { Injectable } from '@nestjs/common'; // > import { Injectable } from '@angular/core';`))
                .toBe(`import { Injectable } from '@angular/core';`);
        });
        it('should remove locale import', () => {
            expect(ttc(`import { something } from './my/import';`)).toBe('');
        });
    });
    describe('transformExport()', () => {
        const ttc = transformToCode(transformer_1.transformExport);
        it('should transform keep export', () => {
            expect(ttc(`export { CpuInfo } from 'os';`)).toBe(`export { CpuInfo } from 'os';`);
        });
        it('should transform locale export', () => {
            const { program } = ast_1.parse(`export { CpuInfo, Abc } from './my/import';`);
            const node = transformer_1.transformExport(program.body[0]);
            expect(node).toEqual(['getCodeTypeMock', 'getCodeTypeMock']);
            expect(code_1.getCodeType).toHaveBeenCalledWith('CpuInfo');
            expect(code_1.getCodeType).toHaveBeenCalledWith('Abc');
        });
        it('should transform export to any if noServerImport=true', () => {
            const noServerImport = true;
            const { program } = ast_1.parse(`export { CpuInfo, Abc } from 'os';`);
            const node = transformer_1.transformExport(program.body[0], noServerImport);
            expect(node).toEqual(['getCodeTypeMock', 'getCodeTypeMock']);
            expect(code_1.getCodeType).toHaveBeenCalledWith('CpuInfo');
            expect(code_1.getCodeType).toHaveBeenCalledWith('Abc');
        });
    });
    describe('transformClass()', () => {
        const ttc = transformToCode(transformer_1.transformClass);
        it('should keep class when implement IsomorShare', () => {
            const code = `export class Post implements IsomorShare {
  @Length(10, 20)
  title: string;
  @Contains("hello")
  text: string;
}`;
            expect(ttc(code)).toBe(code);
        });
        it('should transform class for isomor', () => {
            const code = `@Injectable()
export class CatsService extends Hello {
  findAll(id: string): Cat[] {
    return this.cats;
  }

}`;
            expect(ttc(code)).toBe(`@Injectable()
class CatsService__deco_export__ extends Hello {}

export class CatsService extends CatsService__deco_export__ {
  mock()

}`);
            expect(code_1.getCodeMethod).toHaveBeenCalledTimes(1);
        });
        it('should transform class constructor', () => {
            const code = `@Injectable()
export class CatsService {
    constructor(
        @InjectRepository(Photo)
        private readonly photoRepository: Repository<Photo>,
    ) {}

}`;
            expect(ttc(code)).toBe(`@Injectable()
class CatsService__deco_export__ {}

export class CatsService extends CatsService__deco_export__ {
  constructorMock()

}`);
            expect(code_1.getCodeConstructor).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=transformer.test.js.map