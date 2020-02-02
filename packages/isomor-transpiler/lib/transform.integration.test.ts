// for the moment run integration test within unit test
// since it s a very minimal task

import { parse, generate, JsonAst } from './ast';

import transform from './transform';

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
@isomor
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

// somehow babel put `// > import { Injectable } from '@angular/core';` that kind of weird
// since it doesnt make any problem no need to fix this for the moment
const codeTranspiled =
  `import { isomorRemote } from "isomor";
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
  return isomorRemote("http", "path-to-file", "root", "getTime1", args);
}
export function getTime2(...args: any) {
  return isomorRemote("http", "path-to-file", "root", "getTime2", args);
}
export const getTime3 = (...args: any) => {
  return isomorRemote("http", "path-to-file", "root", "getTime3", args);
};

@Injectable()
@isomor
class CatsService__deco_export__ {}

export class CatsService extends CatsService__deco_export__ {
  constructor(...args: any) {
    super();
  }

  async findAll(...args: any) {
    return isomorRemote("http", "path-to-file", "root", "findAll", args, "CatsService");
  }

}
export class Post implements IsomorShare {
  @Length(10, 20)
  title: string;
  @Contains("hello")
  text: string;
}`;

describe('transform', () => {
  const srcFilePath = 'src-isomor/path/to/file';
  const path = 'path-to-file';
  describe('transform/transform()', () => {
    it('should isomor code for e2e', () => {
      const { program } = parse(codeSource);
      program.body = transform(program.body, {
        srcFilePath,
        path,
        wsReg: null,
        pkgName: 'root',
        withTypes: true,
      });
      const { code } = generate(program as any);
      expect(code).toEqual(codeTranspiled);
    });
  });
});
