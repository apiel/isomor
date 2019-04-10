import generate from '@babel/generator';
import { parse } from '@typescript-eslint/typescript-estree';

import transform from './transform';
import { isomorImport, codeTranspiledFunc, codeTranspiledArrowFunc } from './code.test';

const codeSource = `
import { readdir } from 'fs-extra';

export interface GetListInput {
    foo: string;
}

export function getTime(): Promise<string[]> {
    return readdir('./');
}

export async function getTime(input: { foo: string }): Promise<string[]> {
    return readdir('./');
}

export const getTime = async (hello: string) => {
    return await readdir('./');
};
`;

const codeTranspiled =
`${isomorImport}
export interface GetListInput {
  foo: string;
}
${codeTranspiledFunc}
${codeTranspiledFunc}
${codeTranspiledArrowFunc}`;

describe('transform', () => {
    const path = 'path/to/file';
    const withTypes = true;
    describe('transform/transform()', () => {
        it('should generate inport for isomor', () => {
            const program = parse(codeSource);
            program.body = transform(program.body, path, withTypes);
            const { code } = generate(program as any);
            expect(code).toEqual(codeTranspiled);
        });
    });
});
