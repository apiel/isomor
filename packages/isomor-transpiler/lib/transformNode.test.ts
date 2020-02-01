import { parse } from './ast';

import { transformNode } from './transformNode';
import { transformClass } from './transformer/transformClass';
import { transformImport } from './transformer/transformImport';
import { transformInterface } from './transformer/transformInterface';
import { transformExport } from './transformer/transformExport';
import { transformFunc } from './transformer/transformFunc';
import { transformArrowFunc } from './transformer/transformArrowFunc';
import { transformType } from './transformer/transformType';

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
            expect(transformExport).toHaveBeenCalledWith(node, false);
        });

        it('should transform import', () => {
            const { node, newNode } = transformNodeTest(`import { readdir } from 'fs-extra';`);
            expect(newNode).toEqual('TransformImport');
            expect(transformImport).toHaveBeenCalledWith(node, false);
        });

        it('should transform type', () => {
            const { node, newNode } = transformNodeTest(`export type MyType = string;`);
            expect(newNode).toEqual('TransformType');
            expect(transformType).toHaveBeenCalledWith((node as any).declaration);
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
            expect(transformInterface).toHaveBeenCalledWith(node, noServerImport);
        });

        it('should transform function', () => {
            const { newNode, node } = transformNodeTest(`
export function getTime1(): Promise<string[]> {
    return readdir('./');
}
            `);
            expect(newNode).toEqual('TransformFunc');
            expect(transformFunc).toHaveBeenCalledWith((node as any).declaration, srcFilePath, wsReg, path, pkgName, withTypes);
        });

        it('should transform async function', () => {
            const { newNode, node } = transformNodeTest(`
export async function getTime1(): Promise<string[]> {
    return readdir('./');
}
            `);
            expect(newNode).toEqual('TransformFunc');
            expect(transformFunc).toHaveBeenCalledWith((node as any).declaration, srcFilePath, wsReg, path, pkgName, withTypes);
        });

        it('should transform arrow function', () => {
            const { newNode, node } = transformNodeTest(`
export const getTime1 = async (hello: string) => {
    return await readdir('./');
};
            `);
            expect(newNode).toEqual('TransformArrowFunc');
            expect(transformArrowFunc).toHaveBeenCalledWith((node as any).declaration, srcFilePath, wsReg, path, pkgName, withTypes);
        });

        it('should transform class', () => {
            const noServerImport = false;
            const noDecorator = true;
            const { newNode, node } = transformNodeTest(`
export class MyClass {
}          `, noServerImport, noDecorator);
            expect(newNode).toEqual('TransformClass');
            expect(transformClass).toHaveBeenCalledWith(node, srcFilePath, wsReg, path, pkgName, withTypes, noDecorator);
        });
    });
});

function transformNodeTest(
    code: string,
    noServerImport = false,
    noDecorator = false,
) {
    const { program } = parse(code);
    const node = program.body[0];
    const newNode = transformNode(node, srcFilePath, wsReg, path, pkgName, withTypes, noServerImport, noDecorator);

    return { node, newNode };
}
