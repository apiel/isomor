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
describe('transformFunc()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should transform function', () => {
        const { program } = parse(`export function getTime(input1: string, input2: number): Promise<string[]> {
            return readdir('./');
        }`);
        const node = transformFunc((program.body[0] as any).declaration, srcFilePath, path, withTypes);
        expect(node).toEqual('getCodeFuncMock');
        expect(getCodeFunc).toHaveBeenCalledWith(path, 'getTime', withTypes);
        expect(setValidator).toBeCalledWith((program.body[0] as any).declaration, srcFilePath, path, 'getTime');
    });
});
