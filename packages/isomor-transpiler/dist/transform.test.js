"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("@babel/generator");
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const transform_1 = require("./transform");
const code_1 = require("./code");
const codeSource = `
import { readdir } from 'fs-extra';

export interface GetListInput {
    foo: string;
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
export interface GetListInput {
  foo: string;
}
const Func;
const Func;
const ArrowFunc;`;
jest.mock('./code', () => ({
    getCodeImport: jest.fn().mockReturnValue(getMock('ImportIsomor')),
    getCodeFunc: jest.fn().mockReturnValue(getMock('Func')),
    getCodeArrowFunc: jest.fn().mockReturnValue(getMock('ArrowFunc')),
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
    describe('transform/transform()', () => {
        it('should generate inport for isomor', () => {
            const program = typescript_estree_1.parse(codeSource);
            program.body = transform_1.default(program.body, path, withTypes);
            const { code } = generator_1.default(program);
            expect(code).toEqual(codeTranspiled);
            expect(code_1.getCodeFunc).toHaveBeenCalledTimes(2);
            expect(code_1.getCodeFunc).toHaveBeenCalledWith(path, 'getTime1', true);
            expect(code_1.getCodeFunc).toHaveBeenCalledWith(path, 'getTime2', true);
            expect(code_1.getCodeArrowFunc).toHaveBeenCalledTimes(1);
            expect(code_1.getCodeArrowFunc).toHaveBeenCalledWith(path, 'getTime3', true);
            expect(code_1.getCodeImport).toHaveBeenCalledTimes(1);
        });
        it.skip('should transform interface types to any', () => {
            const codeSource2 = `
                import { CpuInfo } from 'os';

                export interface MyInterface {
                    foo: CpuInfo;
                    bar: {
                        child: CpuInfo;
                    };
                }`;
            const codeTranspiled2 = `const ImportIsomor;
export interface MyInterface {
  foo: any;
  bar: any;
}`;
            const program = typescript_estree_1.parse(codeSource2);
            program.body = transform_1.default(program.body, path, withTypes);
            const { code } = generator_1.default(program);
            expect(code).toEqual(codeTranspiled2);
        });
    });
});
//# sourceMappingURL=transform.test.js.map