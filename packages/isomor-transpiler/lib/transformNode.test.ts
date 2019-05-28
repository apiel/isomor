import { parse } from './ast';

import { transformNode } from './transformNode';
import { getCodeType } from './code';
import { transformClass } from './transformer/transformClass';
import { transformImport } from './transformer/transformImport';
import { transformInterface } from './transformer/transformInterface';
import { transformExport } from './transformer/transformExport';
import { transformFunc } from './transformer/transformFunc';
import { transformArrowFunc } from './transformer/transformArrowFunc';

jest.mock('./code', () => ({
    getCodeType: jest.fn().mockReturnValue('TypeAny'),
}));

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
            expect(transformExport).toHaveBeenCalledWith(node, false);
        });

        it('should transform import', () => {
            const { node, newNode } = transformNodeTest(`import { readdir } from 'fs-extra';`);
            expect(newNode).toEqual('TransformImport');
            expect(transformImport).toHaveBeenCalledWith(node, false);
        });

        it('should transform type', () => {
            const { newNode } = transformNodeTest(`export type MyType = string;`);
            expect(newNode).toEqual('TypeAny');
            expect(getCodeType).toHaveBeenCalledWith('MyType');
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
            expect(transformInterface).toHaveBeenCalledTimes(0);
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
            expect(transformInterface).toHaveBeenCalledWith(node);
        });

        it('should transform function', () => {
            const { newNode, node } = transformNodeTest(`
export function getTime1(): Promise<string[]> {
    return readdir('./');
}
            `);
            expect(newNode).toEqual('TransformFunc');
            expect(transformFunc).toHaveBeenCalledWith((node as any).declaration, path, withTypes);
        });

        it('should transform async function', () => {
            const { newNode, node } = transformNodeTest(`
export async function getTime1(): Promise<string[]> {
    return readdir('./');
}
            `);
            expect(newNode).toEqual('TransformFunc');
            expect(transformFunc).toHaveBeenCalledWith((node as any).declaration, path, withTypes);
        });

        it('should transform arrow function', () => {
            const { newNode, node } = transformNodeTest(`
export const getTime1 = async (hello: string) => {
    return await readdir('./');
};
            `);
            expect(newNode).toEqual('TransformArrowFunc');
            expect(transformArrowFunc).toHaveBeenCalledWith((node as any).declaration, path, withTypes);
        });

        it('should transform class', () => {
            const noServerImport = false;
            const noDecorator = true;
            const { newNode, node } = transformNodeTest(`
export class MyClass {
}          `, noServerImport, noDecorator);
            expect(newNode).toEqual('TransformClass');
            expect(transformClass).toHaveBeenCalledWith(node, path, withTypes, noDecorator);
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
    const newNode = transformNode(node, path, withTypes, noServerImport, noDecorator);

    return { node, newNode };
}
