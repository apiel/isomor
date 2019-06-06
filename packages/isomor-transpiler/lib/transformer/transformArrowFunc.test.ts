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

describe('transformFunc()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should transform arrow function', () => {
        const { program } = parse(`export const getTime = (input1: string, input2: number): Promise<string[]> => {
            return readdir('./');
        }`);
        const node = transformArrowFunc((program.body[0] as any).declaration, srcFilePath, path, pkgName, withTypes);
        expect(node).toEqual('getCodeArrowFuncMock');
        expect(getCodeArrowFunc).toHaveBeenCalledWith(path, 'getTime', withTypes);
        expect(setValidator).toBeCalledWith((program.body[0] as any).declaration.declarations[0].init, srcFilePath, path, 'getTime');
    });
});
