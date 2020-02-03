import { parse } from '../ast';

import { transformFunc } from './transformFunc';
import { getCodeFunc } from '../code';
import { setValidator } from '../validation';

jest.mock('../validation');

jest.mock('../code', () => ({
    getCodeFunc: jest.fn().mockReturnValue('getCodeFuncMock'),
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
    it('should transform function', () => {
        const { program } = parse(`export function getTime(input1: string, input2: number): Promise<string[]> {
            return readdir('./');
        }`);
        const node = transformFunc((program.body[0] as any).declaration, { srcFilePath, wsReg, path, pkgName, withTypes, httpBaseUrl, wsBaseUrl });
        expect(node).toEqual('getCodeFuncMock');
        expect(getCodeFunc).toHaveBeenCalledWith({ bodyParams: { wsReg, path, pkgName, name: 'getTime', httpBaseUrl, wsBaseUrl }, withTypes });
        expect(setValidator).toBeCalledWith((program.body[0] as any).declaration, srcFilePath, path, 'getTime');
    });
});
