"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("@babel/generator");
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const transform_1 = require("./transform");
const code_1 = require("./code");
const transformer_1 = require("./transformer");
const codeSource = `
import { readdir } from 'fs-extra';
import { CpuInfo } from 'os';

export type MyType = string;
export interface MyInterface {
    foo: CpuInfo;
    bar: {
        child: CpuInfo;
    };
}

export function getTime1(): Promise<string[]> {
    return readdir('./');
}

export async function getTime2(input: { foo: string }): Promise<string[]> {
    return readdir('./');
}

export const getTime3 = async (hello: string) => {
    return await readdir('./');
};

function shouldNotBeTranspiled() {
    console.log('hello');
}
`;
const codeTranspiled = `const ImportIsomor;
const TransformImport;
const TransformImport;
const TypeAny;
export interface MyInterface {
  foo: CpuInfo;
  bar: {
    child: CpuInfo;
  };
}
const Func;
const Func;
const ArrowFunc;`;
const codeTranspiledNoServerImport = `const ImportIsomor;
const TypeAny;
const TransformInterface;
const Func;
const Func;
const ArrowFunc;`;
jest.mock('./code', () => ({
    getCodeImport: jest.fn().mockReturnValue(getMock('ImportIsomor')),
    getCodeFunc: jest.fn().mockReturnValue(getMock('Func')),
    getCodeArrowFunc: jest.fn().mockReturnValue(getMock('ArrowFunc')),
    getCodeType: jest.fn().mockReturnValue(getMock('TypeAny')),
}));
jest.mock('./transformer', () => ({
    transformInterface: jest.fn().mockReturnValue(getMock('TransformInterface')),
    transformImport: jest.fn().mockReturnValue(getMock('TransformImport')),
}));
function getMock(name) {
    return {
        type: 'VariableDeclaration',
        declarations: [
            {
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name,
                },
                init: null,
            },
        ],
        kind: 'const',
    };
}
describe('transform', () => {
    const path = 'path/to/file';
    const withTypes = true;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('transform/transform()', () => {
        it('should generate inport for isomor', () => {
            const program = typescript_estree_1.parse(codeSource);
            program.body = transform_1.default(program.body, path, withTypes);
            const { code } = generator_1.default(program);
            expect(code).toEqual(codeTranspiled);
            expect(code_1.getCodeType).toHaveBeenCalledTimes(1);
            expect(code_1.getCodeType).toHaveBeenCalledWith('MyType');
            expect(transformer_1.transformInterface).toHaveBeenCalledTimes(0);
            expect(transformer_1.transformImport).toHaveBeenCalledTimes(2);
            expect(code_1.getCodeFunc).toHaveBeenCalledTimes(2);
            expect(code_1.getCodeFunc).toHaveBeenCalledWith(path, 'getTime1', true);
            expect(code_1.getCodeFunc).toHaveBeenCalledWith(path, 'getTime2', true);
            expect(code_1.getCodeArrowFunc).toHaveBeenCalledTimes(1);
            expect(code_1.getCodeArrowFunc).toHaveBeenCalledWith(path, 'getTime3', true);
            expect(code_1.getCodeImport).toHaveBeenCalledTimes(1);
        });
        it('should generate inport for isomor with noServerImport', () => {
            const program = typescript_estree_1.parse(codeSource);
            const noServerImport = true;
            program.body = transform_1.default(program.body, path, withTypes, noServerImport);
            const { code } = generator_1.default(program);
            expect(code).toEqual(codeTranspiledNoServerImport);
            expect(code_1.getCodeType).toHaveBeenCalledTimes(1);
            expect(code_1.getCodeType).toHaveBeenCalledWith('MyType');
            expect(transformer_1.transformInterface).toHaveBeenCalledTimes(1);
            expect(transformer_1.transformImport).toHaveBeenCalledTimes(0);
            expect(code_1.getCodeFunc).toHaveBeenCalledTimes(2);
            expect(code_1.getCodeFunc).toHaveBeenCalledWith(path, 'getTime1', true);
            expect(code_1.getCodeFunc).toHaveBeenCalledWith(path, 'getTime2', true);
            expect(code_1.getCodeArrowFunc).toHaveBeenCalledTimes(1);
            expect(code_1.getCodeArrowFunc).toHaveBeenCalledWith(path, 'getTime3', true);
            expect(code_1.getCodeImport).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=transform.test.js.map