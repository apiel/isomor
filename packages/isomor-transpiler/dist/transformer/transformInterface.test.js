"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const transformInterface_1 = require("./transformInterface");
const util_1 = require("util");
const codeSourceInterface = `export interface MyInterface {
  hello: string;
  foo: CpuInfo;
  bar: {
    child: CpuInfo;
  };
  world: CpuInfo[];
}`;
const codeTranspiledInterface = `export interface MyInterface {
  hello: string;
  foo: any;
  bar: {
    child: any;
  };
  world: any;
}`;
const transformInterfaceFromCode = (source, noServerImport) => {
    const { program } = ast_1.parse(source);
    const body = transformInterface_1.transformInterface(program.body[0], noServerImport);
    program.body = util_1.isArray(body) ? body : [body];
    const { code } = ast_1.generate(program);
    return code;
};
describe('transformInterface()', () => {
    it('should keep interface as it is if noServerImport is false', () => {
        expect(transformInterfaceFromCode(codeSourceInterface, false)).toBe(codeSourceInterface);
    });
    it('should transform props interface to any if noServerImport is true', () => {
        expect(transformInterfaceFromCode(codeSourceInterface, true)).toBe(codeTranspiledInterface);
    });
});
//# sourceMappingURL=transformInterface.test.js.map