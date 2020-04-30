import { parse } from './ast';

import { transformNode } from './transformNode';
import { transformImport } from './transformer/transformImport';
import { transformInterface } from './transformer/transformInterface';
import { transformExport } from './transformer/transformExport';
import { transformDefaultFunc } from './transformer/transformDefaultFunc';
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

        // it('should transform export from', () => {
        //     const { node, newNode } = transformNodeTest(`export { CpuInfo } from 'os';`);
        //     expect(newNode).toEqual('TransformExport');
        //     expect(transformExport).toHaveBeenCalledWith(node, false);
        // });

        it('should keep import', () => {
            const { node, newNode } = transformNodeTest(`import { readdir } from 'fs-extra';`);
            expect(newNode).toEqual(node);
        });

        it('should transform type', () => {
            const { node, newNode } = transformNodeTest(`export type MyType = string;`);
            expect(newNode).toEqual('TransformType');
            expect(transformType).toHaveBeenCalledWith((node as any).declaration);
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
            expect(transformInterface).toHaveBeenCalledWith(node, noServerImport);
        });

        it('should transform default exported function', () => {
            // should use source from transformer/transformDefaultFunc.test.ts
            // but for some reason doesnt want to work
            const { newNode, node } = transformNodeTest(`
            export default function(hello: string) {
                return readdir('./');
            }`);
            expect(newNode).toEqual('TransformDefaultFunc');
            expect(transformDefaultFunc).toHaveBeenCalledWith((node as any).declaration, bodyParams);
        });

//         it('should transform arrow function', () => {
//             const { newNode, node } = transformNodeTest(`
// export const getTime1 = async (hello: string) => {
//     return await readdir('./');
// };
//             `);
//             expect(newNode).toEqual('TransformArrowFunc');
//             expect(transformArrowFunc).toHaveBeenCalledWith((node as any).declaration, bodyParams);
//         });
    });
});

function transformNodeTest(
    code: string,
    noServerImport = false,
    noDecorator = false,
) {
    const { program } = parse(code);
    const node = program.body[0];
    const newNode = transformNode(
        node,
        bodyParams,
        noServerImport,
        noDecorator,
    );

    return { node, newNode };
}
