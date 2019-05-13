"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("./ast");
const transform_1 = require("./transform");
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

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  findAll(id: string): Cat[] {
    return this.cats;
  }
}

export class Post implements IsomorShare {
    @Length(10, 20)
    title: string;

    @Contains("hello")
    text: string;
}
`;
const codeTranspiled = `import { remote } from "isomor";
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
export function getTime1(...args: any) {
  return remote("path/to/file", "getTime1", args);
}
export function getTime2(...args: any) {
  return remote("path/to/file", "getTime2", args);
}
export const getTime3 = (...args: any) => {
  return remote("path/to/file", "getTime3", args);
};

@Injectable()
class CatsService__deco_export__ {}

export class CatsService extends CatsService__deco_export__ {
  constructor(...args: any) {
    super(...args);
  }

  async findAll(...args: any) {
    return remote("path/to/file", "findAll", args, "CatsService");
  }

}
export class Post implements IsomorShare {
  @Length(10, 20)
  title: string;
  @Contains("hello")
  text: string;
}`;
const codeTranspiledNoServerImport = `import { remote } from "isomor";
import { Injectable } from '@angular/core';
export type CpuInfo = any;
export type Hello = any;
export type Abc = any;
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
};

@Injectable()
class CatsService__deco_export__ {}

export class CatsService extends CatsService__deco_export__ {
  constructor(...args: any) {
    super(...args);
  }

  async findAll(...args: any) {
    return remote("path/to/file", "findAll", args, "CatsService");
  }

}
export class Post implements IsomorShare {
  @Length(10, 20)
  title: string;
  @Contains("hello")
  text: string;
}`;
describe('transform', () => {
    const path = 'path/to/file';
    const withTypes = true;
    describe('transform/transform()', () => {
        it('should isomor code for e2e', () => {
            const { program } = ast_1.parse(codeSource);
            program.body = transform_1.default(program.body, path, withTypes);
            const { code } = ast_1.generate(program);
            expect(code).toEqual(codeTranspiled);
        });
        it('should isomor code for e2e with noServerImport', () => {
            const { program } = ast_1.parse(codeSource);
            const noServerImport = true;
            program.body = transform_1.default(program.body, path, withTypes, noServerImport);
            const { code } = ast_1.generate(program);
            expect(code).toEqual(codeTranspiledNoServerImport);
        });
    });
});
//# sourceMappingURL=transform.integration.test.js.map