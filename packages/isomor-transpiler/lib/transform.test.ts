import generate from '@babel/generator';
import { parse } from '@typescript-eslint/typescript-estree';

import transform from './transform';
import { getCodeImport, getCodeFunc, getCodeArrowFunc, getCodeType } from './code';

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

const codeTranspiled =
    `const ImportIsomor;
const TypeAny;
const TypeAny;
const Func;
const Func;
const ArrowFunc;`;

jest.mock('./code', () => ({
    getCodeImport: jest.fn().mockReturnValue(getMock('ImportIsomor')),
    getCodeFunc: jest.fn().mockReturnValue(getMock('Func')),
    getCodeArrowFunc: jest.fn().mockReturnValue(getMock('ArrowFunc')),
    getCodeType: jest.fn().mockReturnValue(getMock('TypeAny')),
}));

// getMock('abc') return ast for `const abc;`
function getMock(name: string) {
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
            const program = parse(codeSource);
            program.body = transform(program.body, path, withTypes);
            const { code } = generate(program as any);
            expect(code).toEqual(codeTranspiled);

            expect(getCodeType).toHaveBeenCalledTimes(2);
            expect(getCodeType).toHaveBeenCalledWith('MyType');
            expect(getCodeType).toHaveBeenCalledWith('MyInterface');

            expect(getCodeFunc).toHaveBeenCalledTimes(2);
            expect(getCodeFunc).toHaveBeenCalledWith(path, 'getTime1', true);
            expect(getCodeFunc).toHaveBeenCalledWith(path, 'getTime2', true);

            expect(getCodeArrowFunc).toHaveBeenCalledTimes(1);
            expect(getCodeArrowFunc).toHaveBeenCalledWith(path, 'getTime3', true);

            expect(getCodeImport).toHaveBeenCalledTimes(1);
        });
    });
});
