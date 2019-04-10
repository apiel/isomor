import generate from '@babel/generator';
import { parse } from '@typescript-eslint/typescript-estree';

import transform from './transform';

const codeSource = `
import { readdir } from 'fs-extra';

export interface GetListInput {
    foo: string;
}

export function getList(): Promise<string[]> {
    return readdir('./');
}

export async function getListFoo(input: { foo: string }): Promise<string[]> {
    return readdir('./');
}

export const getList2 = async (hello: string) => {
    return await readdir('./');
};
`;

const trim = (str: string) => str.replace(/^ +/gm, '');

describe('transform', () => {
    const path = 'path/to/file';
    const withTypes = true;
    describe('transform/transform()', () => {
        it('should generate inport for isomor', () => {
            const program = parse(codeSource);
            program.body = transform(program.body, path, withTypes);
            const { code } = generate(program as any);
            expect(trim(code)).toEqual(
                trim(`import { remote } from "isomor";
                export interface GetListInput {
                    foo: string;
                }
                export function getList(...args: any) {
                    return remote("path/to/file", "getList", args);
                }
                export function getListFoo(...args: any) {
                    return remote("path/to/file", "getListFoo", args);
                }
                export const getList2 = (...args: any) => {
                    return remote("path/to/file", "getList2", args);
                };`));
        });
    });
});
