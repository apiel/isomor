"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("@babel/generator");
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
const transform_1 = require("./transform");
const codeSource = `
import { readdir } from 'fs-extra';
import { CpuInfo } from 'os';
import { something } from './my/import';

export { CpuInfo } from 'os';

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
const codeTranspiled = `import { remote } from "isomor";
import { readdir } from "fs-extra";
import { CpuInfo } from "os";
export { CpuInfo } from "os";
export type MyType = any;
export interface MyInterface {
  foo: CpuInfo;
  bar: {
    child: CpuInfo;
  };
}
export function getTime1(...args: any) {
  return remote("path/to/file", "getTime1", args);
}
export function getTime2(...args: any) {
  return remote("path/to/file", "getTime2", args);
}
export const getTime3 = (...args: any) => {
  return remote("path/to/file", "getTime3", args);
};`;
const codeTranspiledNoServerImport = `import { remote } from "isomor";
export { CpuInfo } from "os";
export type MyType = any;
export interface MyInterface {
  foo: any;
  bar: {
    child: any;
  };
}
export function getTime1(...args: any) {
  return remote("path/to/file", "getTime1", args);
}
export function getTime2(...args: any) {
  return remote("path/to/file", "getTime2", args);
}
export const getTime3 = (...args: any) => {
  return remote("path/to/file", "getTime3", args);
};`;
describe('transform', () => {
    const path = 'path/to/file';
    const withTypes = true;
    describe('transform/transform()', () => {
        it('should generate import for isomor', () => {
            const program = typescript_estree_1.parse(codeSource);
            program.body = transform_1.default(program.body, path, withTypes);
            const { code } = generator_1.default(program);
            expect(code).toEqual(codeTranspiled);
        });
        it('should generate import for isomor with noServerImport', () => {
            const program = typescript_estree_1.parse(codeSource);
            const noServerImport = true;
            program.body = transform_1.default(program.body, path, withTypes, noServerImport);
            const { code } = generator_1.default(program);
            expect(code).toEqual(codeTranspiledNoServerImport);
        });
    });
});
//# sourceMappingURL=transform.integration.test.js.map