import generate from '@babel/generator';
import { parse } from '@typescript-eslint/typescript-estree';

import transform from './transform';
import { getCodeImport, getCodeFunc, getCodeArrowFunc } from './code';

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

const codeTranspiled =
`const ImportIsomor;
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
            expect(getCodeFunc).toHaveBeenCalledTimes(2);
            expect(getCodeFunc).toHaveBeenCalledWith(path, 'getTime1', true);
            expect(getCodeFunc).toHaveBeenCalledWith(path, 'getTime2', true);
            expect(getCodeArrowFunc).toHaveBeenCalledTimes(1);
            expect(getCodeArrowFunc).toHaveBeenCalledWith(path, 'getTime3', true);
            expect(getCodeImport).toHaveBeenCalledTimes(1);
        });

        // we should transform every type to any in interface
        it.skip('should transform interface types to any', () => {
            const codeSource2 = `
                import { CpuInfo } from 'os';

                export interface MyInterface {
                    foo: CpuInfo;
                    bar: {
                        child: CpuInfo;
                    };
                }`;

            const codeTranspiled2 =
`const ImportIsomor;
export interface MyInterface {
  foo: any;
  bar: any;
}`;
            const program = parse(codeSource2);
            program.body = transform(program.body, path, withTypes);
            const { code } = generate(program as any);
            expect(code).toEqual(codeTranspiled2);
        });
    });
});
