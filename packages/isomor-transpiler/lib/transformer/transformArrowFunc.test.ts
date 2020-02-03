import { parse } from '../ast';

import { transformArrowFunc } from './transformArrowFunc';
import { getCodeArrowFunc } from '../code';
import { setValidator } from '../validation';

jest.mock('../validation');

jest.mock('../code', () => ({
    getCodeArrowFunc: jest.fn().mockReturnValue('getCodeArrowFuncMock'),
}));

jest.mock('logol');

const srcFilePath = 'src-isomor/path/to/file';
const path = 'path-to-file';
const withTypes = true;
const pkgName = 'root';
const wsReg = null;
const httpBaseUrl = '';
const wsBaseUrl = 'ws://127.0.0.1:3005';

describe('transformFunc()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should transform arrow function', () => {
        const { program } = parse(`export const getTime = (input1: string, input2: number): Promise<string[]> => {
            return readdir('./');
        }`);
        const node = transformArrowFunc(
            (program.body[0] as any).declaration,
            { srcFilePath, wsReg, path, pkgName, withTypes, httpBaseUrl, wsBaseUrl },
        );
        expect(node).toEqual('getCodeArrowFuncMock');
        expect(getCodeArrowFunc).toHaveBeenCalledWith({ bodyParams: { wsReg, path, pkgName, name: 'getTime', httpBaseUrl, wsBaseUrl }, withTypes });
        expect(setValidator).toBeCalledWith((program.body[0] as any).declaration.declarations[0].init, srcFilePath, path, 'getTime');
    });
});
