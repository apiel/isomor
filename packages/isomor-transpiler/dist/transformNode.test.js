"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("./ast");
const transformNode_1 = require("./transformNode");
const transformClass_1 = require("./transformer/transformClass");
const transformImport_1 = require("./transformer/transformImport");
const transformInterface_1 = require("./transformer/transformInterface");
const transformExport_1 = require("./transformer/transformExport");
const transformFunc_1 = require("./transformer/transformFunc");
const transformArrowFunc_1 = require("./transformer/transformArrowFunc");
const transformType_1 = require("./transformer/transformType");
jest.mock('./transformer/transformExport', () => ({
    transformExport: jest.fn().mockReturnValue('TransformExport'),
}));
jest.mock('./transformer/transformInterface', () => ({
    transformInterface: jest.fn().mockReturnValue('TransformInterface'),
}));
jest.mock('./transformer/transformImport', () => ({
    transformImport: jest.fn().mockReturnValue('TransformImport'),
}));
jest.mock('./transformer/transformClass', () => ({
    transformClass: jest.fn().mockReturnValue('TransformClass'),
}));
jest.mock('./transformer/transformFunc', () => ({
    transformFunc: jest.fn().mockReturnValue('TransformFunc'),
}));
jest.mock('./transformer/transformArrowFunc', () => ({
    transformArrowFunc: jest.fn().mockReturnValue('TransformArrowFunc'),
}));
jest.mock('./transformer/transformType', () => ({
    transformType: jest.fn().mockReturnValue('TransformType'),
}));
const srcFilePath = 'src-isomor/path/to/file';
const path = 'path-to-file';
const withTypes = true;
const pkgName = 'root';
const wsReg = null;
const httpBaseUrl = '';
const wsBaseUrl = 'ws://127.0.0.1:3005';
const bodyParams = { srcFilePath, wsReg, path, pkgName, withTypes, httpBaseUrl, wsBaseUrl };
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
            expect(transformExport_1.transformExport).toHaveBeenCalledWith(node, false);
        });
        it('should transform import', () => {
            const { node, newNode } = transformNodeTest(`import { readdir } from 'fs-extra';`);
            expect(newNode).toEqual('TransformImport');
            expect(transformImport_1.transformImport).toHaveBeenCalledWith(node, false);
        });
        it('should transform type', () => {
            const { node, newNode } = transformNodeTest(`export type MyType = string;`);
            expect(newNode).toEqual('TransformType');
            expect(transformType_1.transformType).toHaveBeenCalledWith(node.declaration);
        });
        it('should not transform enum', () => {
            const { node, newNode } = transformNodeTest(`export enum RemoteType {
                GitHub,
                GitLab,
              }`);
            expect(newNode).toEqual(node);
        });
        it('should transform interface', () => {
            const noServerImport = true;
            const { newNode, node } = transformNodeTest(`
export interface MyInterface {
    foo: CpuInfo;
    bar: {
        child: CpuInfo;
    };
}          `, noServerImport);
            expect(newNode).toEqual('TransformInterface');
            expect(transformInterface_1.transformInterface).toHaveBeenCalledWith(node, noServerImport);
        });
        it('should transform function', () => {
            const { newNode, node } = transformNodeTest(`
export function getTime1(): Promise<string[]> {
    return readdir('./');
}
            `);
            expect(newNode).toEqual('TransformFunc');
            expect(transformFunc_1.transformFunc).toHaveBeenCalledWith(node.declaration, bodyParams);
        });
        it('should transform async function', () => {
            const { newNode, node } = transformNodeTest(`
export async function getTime1(): Promise<string[]> {
    return readdir('./');
}
            `);
            expect(newNode).toEqual('TransformFunc');
            expect(transformFunc_1.transformFunc).toHaveBeenCalledWith(node.declaration, bodyParams);
        });
        it('should transform arrow function', () => {
            const { newNode, node } = transformNodeTest(`
export const getTime1 = async (hello: string) => {
    return await readdir('./');
};
            `);
            expect(newNode).toEqual('TransformArrowFunc');
            expect(transformArrowFunc_1.transformArrowFunc).toHaveBeenCalledWith(node.declaration, bodyParams);
        });
        it('should transform class', () => {
            const noServerImport = false;
            const noDecorator = true;
            const { newNode, node } = transformNodeTest(`
export class MyClass {
}          `, noServerImport, noDecorator);
            expect(newNode).toEqual('TransformClass');
            expect(transformClass_1.transformClass).toHaveBeenCalledWith(node, bodyParams, noDecorator);
        });
    });
});
function transformNodeTest(code, noServerImport = false, noDecorator = false) {
    const { program } = ast_1.parse(code);
    const node = program.body[0];
    const newNode = transformNode_1.transformNode(node, bodyParams, noServerImport, noDecorator);
    return { node, newNode };
}
//# sourceMappingURL=transformNode.test.js.map