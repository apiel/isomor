"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("./ast");
const transformNode_1 = require("./transformNode");
const transformInterface_1 = require("./transformer/transformInterface");
const transformDefaultFunc_1 = require("./transformer/transformDefaultFunc");
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
jest.mock('./transformer/transformDefaultFunc', () => ({
    transformDefaultFunc: jest.fn().mockReturnValue('TransformDefaultFunc'),
}));
jest.mock('./transformer/transformArrowFunc', () => ({
    transformArrowFunc: jest.fn().mockReturnValue('TransformArrowFunc'),
}));
jest.mock('./transformer/transformType', () => ({
    transformType: jest.fn().mockReturnValue('TransformType'),
}));
const srcFilePath = 'src-isomor/path/to/file';
const moduleName = 'api';
const wsReg = null;
const httpBaseUrl = '';
const wsBaseUrl = 'ws://127.0.0.1:3005';
const declaration = true;
const bodyParams = { srcFilePath, wsReg, moduleName, httpBaseUrl, wsBaseUrl, declaration };
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
        it('should keep import', () => {
            const { node, newNode } = transformNodeTest(`import { readdir } from 'fs-extra';`);
            expect(newNode).toEqual(node);
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
}          `);
            expect(newNode).toEqual('TransformInterface');
            expect(transformInterface_1.transformInterface).toHaveBeenCalledWith(node, noServerImport);
        });
        it('should transform default exported function', () => {
            const { newNode, node } = transformNodeTest(`
            export default function(hello: string) {
                return readdir('./');
            }`);
            expect(newNode).toEqual('TransformDefaultFunc');
            expect(transformDefaultFunc_1.transformDefaultFunc).toHaveBeenCalledWith(node.declaration, bodyParams);
        });
    });
});
function transformNodeTest(code) {
    const { program } = ast_1.parse(code);
    const node = program.body[0];
    const newNode = transformNode_1.transformNode(node, bodyParams);
    return { node, newNode };
}
//# sourceMappingURL=transformNode.test.js.map