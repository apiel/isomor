import { parse, generate, JsonAst } from './ast';

import { getCodeImport, getCodeFunc, getCodeArrowFunc, getCodeType, getCodeMethod, getCodeConstructor } from './code';

export const codeTranspiledFunc =
`export function getTime(...args: any) {
  const [input1, input2] = args;
  const argsObject = {
    input1,
    input2
  };
  return isomorRemote("path/to/file", "getTime", args, argsObject);
}`;

export const codeTranspiledFuncNoType =
`export function getTime(...args) {
  const [input1, input2] = args;
  const argsObject = {
    input1,
    input2
  };
  return isomorRemote("path/to/file", "getTime", args, argsObject);
}`;

export const codeTranspiledArrowFunc =
`export const getTime = (...args: any) => {
  const [input1, input2] = args;
  const argsObject = {
    input1,
    input2
  };
  return isomorRemote("path/to/file", "getTime", args, argsObject);
};`;

export const codeTranspiledArrowFuncNoType =
`export const getTime = (...args) => {
  const [input1, input2] = args;
  const argsObject = {
    input1,
    input2
  };
  return isomorRemote("path/to/file", "getTime", args, argsObject);
};`;

export const codeTranspiledClass =
`async getTime(...args: any) {
  const [input1, input2] = args;
  const argsObject = {
    input1,
    input2
  };
  return isomorRemote("path/to/file", "getTime", args, argsObject, "CatsService");
}`;

describe('code', () => {
    const path = 'path/to/file';
    const fnName = 'getTime';
    const className = 'CatsService';
    const typeName = 'MyType';
    const args = ['input1', 'input2'];

    describe('code/getCodeMethod()', () => {
        it('should generate method for isomor', () => {
            const withType = true;
            const { code } = generate(getCodeMethod(path, fnName, className, args, withType) as any);
            expect(code).toEqual(codeTranspiledClass);
        });
    });

    describe('code/getCodeConstructor()', () => {
        it('should generate constructor for isomor', () => {
            const withType = true;
            const { code } = generate(getCodeConstructor(withType) as any);
            expect(code).toEqual(
`constructor(...args: any) {
  super();
}`,
            );
        });
    });

    describe('code/getCodeImport()', () => {
        it('should generate inport for isomor', () => {
            const { code } = generate(getCodeImport() as any);
            expect(code).toEqual(`import { isomorRemote } from "isomor";`);
        });
    });

    describe('code/getCodeType()', () => {
        it('should generate type for isomor', () => {
            const { code } = generate(getCodeType(typeName) as any);
            expect(code).toEqual(`export type MyType = any;`);
        });
    });

    describe('code/getCodeFunc()', () => {
        it('should generate function for isomor', () => {
            const withType = true;
            const { code } = generate(getCodeFunc(path, fnName, args, withType) as any);
            expect(code).toEqual(codeTranspiledFunc);
        });

        it('should generate function for isomor without type', () => {
            const withType = false;
            const { code } = generate(getCodeFunc(path, fnName, args, withType) as any);
            expect(code).toEqual(codeTranspiledFuncNoType);
        });
    });

    describe('code/getCodeArrowFunc()', () => {
        it('should generate function for isomor', () => {
            const withType = true;
            const { code } = generate(getCodeArrowFunc(path, fnName, args, withType) as any);
            expect(code).toEqual(codeTranspiledArrowFunc);
        });

        it('should generate function for isomor without type', () => {
            const withType = false;
            const { code } = generate(getCodeArrowFunc(path, fnName, args, withType) as any);
            expect(code).toEqual(codeTranspiledArrowFuncNoType);
        });
    });
});
