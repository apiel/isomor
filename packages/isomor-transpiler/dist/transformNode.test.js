"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("./ast");
const transformNode_1 = require("./transformNode");
const code_1 = require("./code");
const transformer_1 = require("./transformer/transformer");
const transformerClass_1 = require("./transformer/transformerClass");
const transformerImport_1 = require("./transformer/transformerImport");
jest.mock('./code', () => ({
    getCodeImport: jest.fn().mockReturnValue('ImportIsomor'),
    getCodeFunc: jest.fn().mockReturnValue('Func'),
    getCodeArrowFunc: jest.fn().mockReturnValue('ArrowFunc'),
    getCodeType: jest.fn().mockReturnValue('TypeAny'),
}));
jest.mock('./transformer/transformer', () => ({
    transformInterface: jest.fn().mockReturnValue('TransformInterface'),
    transformExport: jest.fn().mockReturnValue('TransformExport'),
    transformClass: jest.fn().mockReturnValue('TransformClass'),
}));
jest.mock('./transformer/transformerImport', () => ({
    transformImport: jest.fn().mockReturnValue('TransformImport'),
}));
jest.mock('./transformer/transformerClass', () => ({
    transformClass: jest.fn().mockReturnValue('TransformClass'),
}));
const path = 'path/to/file';
const withTypes = true;
describe('transform', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('transformNode/transformNode()', () => {
        it('should return undefined for code without export', () => {
            const { newNode } = transformNodeTest(`
function shouldNotBeTranspiled() {
    console.log('hello');
}
            `);
            expect(newNode).toBeUndefined();
        });
        it('should transform export from', () => {
            const { node, newNode } = transformNodeTest(`export { CpuInfo } from 'os';`);
            expect(newNode).toEqual('TransformExport');
            expect(transformer_1.transformExport).toHaveBeenCalledWith(node, false);
        });
        it('should transform import', () => {
            const { node, newNode } = transformNodeTest(`import { readdir } from 'fs-extra';`);
            expect(newNode).toEqual('TransformImport');
            expect(transformerImport_1.transformImport).toHaveBeenCalledWith(node, false);
        });
        it('should transform type', () => {
            const { newNode } = transformNodeTest(`export type MyType = string;`);
            expect(newNode).toEqual('TypeAny');
            expect(code_1.getCodeType).toHaveBeenCalledWith('MyType');
        });
        it('should transform interface with noServerImport=false', () => {
            const { newNode, node } = transformNodeTest(`
export interface MyInterface {
    foo: CpuInfo;
    bar: {
        child: CpuInfo;
    };
}          `);
            expect(newNode).toEqual(node);
            expect(transformer_1.transformInterface).toHaveBeenCalledTimes(0);
        });
        it('should transform interface with noServerImport=true', () => {
            const noServerImport = true;
            const { newNode, node } = transformNodeTest(`
export interface MyInterface {
    foo: CpuInfo;
    bar: {
        child: CpuInfo;
    };
}          `, noServerImport);
            expect(newNode).toEqual('TransformInterface');
            expect(transformer_1.transformInterface).toHaveBeenCalledWith(node);
        });
        it('should transform function', () => {
            const { newNode } = transformNodeTest(`
export function getTime1(): Promise<string[]> {
    return readdir('./');
}
            `);
            expect(newNode).toEqual('Func');
            expect(code_1.getCodeFunc).toHaveBeenCalledWith(path, 'getTime1', withTypes);
        });
        it('should transform async function', () => {
            const { newNode } = transformNodeTest(`
export async function getTime1(): Promise<string[]> {
    return readdir('./');
}
            `);
            expect(newNode).toEqual('Func');
            expect(code_1.getCodeFunc).toHaveBeenCalledWith(path, 'getTime1', withTypes);
        });
        it('should transform arrow function', () => {
            const { newNode } = transformNodeTest(`
export const getTime1 = async (hello: string) => {
    return await readdir('./');
};
            `);
            expect(newNode).toEqual('ArrowFunc');
            expect(code_1.getCodeArrowFunc).toHaveBeenCalledWith(path, 'getTime1', withTypes);
        });
        it('should transform class', () => {
            const noServerImport = false;
            const noDecorator = true;
            const { newNode, node } = transformNodeTest(`
export class MyClass {
}          `, noServerImport, noDecorator);
            expect(newNode).toEqual('TransformClass');
            expect(transformerClass_1.transformClass).toHaveBeenCalledWith(node, path, withTypes, noDecorator);
        });
    });
});
function transformNodeTest(code, noServerImport = false, noDecorator = false) {
    const { program } = ast_1.parse(code);
    const node = program.body[0];
    const newNode = transformNode_1.transformNode(node, path, withTypes, noServerImport, noDecorator);
    return { node, newNode };
}
//# sourceMappingURL=transformNode.test.js.map