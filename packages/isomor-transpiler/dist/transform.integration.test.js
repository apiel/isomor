"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("./ast");
const transform_1 = require("./transform");
jest.mock('./validation');
const codeSource = `
import { Injectable } from '@nestjs/common'; // > import { Injectable } from '@angular/core';
import { readdir } from 'fs-extra';
import { CpuInfo } from 'os';
import { something } from './my/import';

export { CpuInfo } from 'os';
export { Hello, Abc } from './my/import';

export type MyType = string;
export interface MyInterface {
    foo: CpuInfo;
    bar: {
        child: CpuInfo;
    };
}

export enum RemoteType {
  GitHub,
  GitLab,
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
const codeTranspiled = `import { isomorRemote } from "isomor";
import { Injectable } from '@angular/core';
// > import { Injectable } from '@angular/core';
import { readdir } from 'fs-extra';
import { CpuInfo } from 'os';
export { CpuInfo } from 'os';
export type Hello = any;
export type Abc = any;
export type MyType = any;
export interface MyInterface {
  foo: CpuInfo;
  bar: {
    child: CpuInfo;
  };
}
export enum RemoteType {
  GitHub,
  GitLab,
}
export function getTime1(...args: any) {
  return isomorRemote("http", "", "path-to-file", "root", "getTime1", args);
}
export function getTime2(...args: any) {
  return isomorRemote("http", "", "path-to-file", "root", "getTime2", args);
}
export const getTime3 = (...args: any) => {
  return isomorRemote("http", "", "path-to-file", "root", "getTime3", args);
};`;
describe('transform', () => {
    const srcFilePath = 'src-isomor/path/to/file';
    const path = 'path-to-file';
    describe('transform/transform()', () => {
        it('should isomor code for e2e', () => {
            const { program } = ast_1.parse(codeSource);
            program.body = transform_1.default(program.body, {
                srcFilePath,
                wsReg: null,
                moduleName: 'root',
                declaration: true,
                httpBaseUrl: '',
                wsBaseUrl: 'ws://127.0.0.1:3005',
            });
            const { code } = ast_1.generate(program);
            expect(code).toEqual(codeTranspiled);
        });
    });
});
//# sourceMappingURL=transform.integration.test.js.map