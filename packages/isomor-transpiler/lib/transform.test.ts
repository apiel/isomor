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

jest.mock('./code', () => ({
    getCodeImport: jest.fn(),
    getCodeFunc: jest.fn(),
    getCodeArrowFunc: jest.fn(),
}));

// ./code is mocked most of the code is removed
const codeTranspiled =
`export interface GetListInput {
  foo: string;
}`;

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
    });
});
