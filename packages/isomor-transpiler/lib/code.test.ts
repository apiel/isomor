import generate from '@babel/generator';
import { parse } from '@typescript-eslint/typescript-estree';

import { getCodeImport, getCodeFunc, getCodeArrowFunc } from './code';

describe('code', () => {
    describe('code/getCodeImport()', () => {
        it('should generate inport for isomor', () => {
            const program = parse('');
            program.body = [getCodeImport()];
            const { code } = generate(program as any);
            expect(code).toEqual(`import { remote } from "isomor";`);
        });
    });

    describe('code/getCodeFunc()', () => {
        it('should generate function for isomor', () => {
            const filename = 'test';
            const name = 'getTime';
            const withType = true;
            const program = parse('');
            program.body = [getCodeFunc(filename, name, withType)];
            const { code } = generate(program as any);
            expect(code).toEqual(
`export function ${name}(...args: any) {
  return remote("${filename}", "${name}", args);
}` // tslint:disable-line
            );
        });

        it('should generate function for isomor without type', () => {
            const filename = 'test';
            const name = 'getTime';
            const withType = false;
            const program = parse('');
            program.body = [getCodeFunc(filename, name, withType)];
            const { code } = generate(program as any);
            expect(code).toEqual(
`export function ${name}(...args) {
  return remote("${filename}", "${name}", args);
}` // tslint:disable-line
            );
        });
    });

    describe('code/getCodeArrowFunc()', () => {
        it('should generate function for isomor', () => {
            const filename = 'test';
            const name = 'getTime';
            const withType = true;
            const program = parse('');
            program.body = [getCodeArrowFunc(filename, name, withType)];
            const { code } = generate(program as any);
            expect(code).toEqual(
`export const ${name} = (...args: any) => {
  return remote("${filename}", "${name}", args);
};` // tslint:disable-line
            );
        });

        it('should generate function for isomor without type', () => {
            const filename = 'test';
            const name = 'getTime';
            const withType = false;
            const program = parse('');
            program.body = [getCodeArrowFunc(filename, name, withType)];
            const { code } = generate(program as any);
            expect(code).toEqual(
`export const ${name} = (...args) => {
  return remote("${filename}", "${name}", args);
};` // tslint:disable-line
            );
        });
    });
});
