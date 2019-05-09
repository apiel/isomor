import { parse } from './ast';

import { transformNode } from './transformNode';
import { getCodeFunc, getCodeArrowFunc, getCodeType } from './code';
import { transformInterface, transformImport, transformExport } from './transformer';

jest.mock('./code', () => ({
    getCodeImport: jest.fn().mockReturnValue('ImportIsomor'),
    getCodeFunc: jest.fn().mockReturnValue('Func'),
    getCodeArrowFunc: jest.fn().mockReturnValue('ArrowFunc'),
    getCodeType: jest.fn().mockReturnValue('TypeAny'),
}));

jest.mock('./transformer', () => ({
    transformInterface: jest.fn().mockReturnValue('TransformInterface'),
    transformImport: jest.fn().mockReturnValue('TransformImport'),
    transformExport: jest.fn().mockReturnValue('TransformExport'),
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
            expect(transformImport).toHaveBeenCalledWith(node);
        });

        it('should return undefined for import with noServerImport=true', () => {
            const noServerImport = true;
            const { newNode } = transformNodeTest(`import { readdir } from 'fs-extra';`, noServerImport);
            expect(newNode).toBeUndefined();
            expect(transformExport).toHaveBeenCalledTimes(0);
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
            const { newNode } = transformNodeTest(`
export function getTime1(): Promise<string[]> {
    return readdir('./');
}
            `);
            expect(newNode).toEqual('Func');
            expect(getCodeFunc).toHaveBeenCalledWith(path, 'getTime1', withTypes);
        });

        it('should transform async function', () => {
            const { newNode } = transformNodeTest(`
export async function getTime1(): Promise<string[]> {
    return readdir('./');
}
            `);
            expect(newNode).toEqual('Func');
            expect(getCodeFunc).toHaveBeenCalledWith(path, 'getTime1', withTypes);
        });

        it('should transform arrow function', () => {
            const { newNode } = transformNodeTest(`
export const getTime1 = async (hello: string) => {
    return await readdir('./');
};
            `);
            expect(newNode).toEqual('ArrowFunc');
            expect(getCodeArrowFunc).toHaveBeenCalledWith(path, 'getTime1', withTypes);
        });
    });
});

function transformNodeTest(
    code: string,
    noServerImport = false,
) {
    const { program } = parse(code);
    const node = program.body[0];
    const newNode = transformNode(node, path, withTypes, noServerImport);

    return { node, newNode };
}
