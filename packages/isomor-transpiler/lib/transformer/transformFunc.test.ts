import { parse } from '../ast';

import { transformFunc } from './transformFunc';
import { getCodeFunc } from '../code';
import { getArgs } from './utils/getArgs';

jest.mock('./utils/getArgs', () => ({
    getArgs: jest.fn().mockReturnValue(['input1', 'input2']),
}));

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
        expect(getCodeFunc).toHaveBeenCalledWith(path, 'getTime', ['input1', 'input2'], withTypes);
        expect(getArgs).toBeCalledWith((program.body[0] as any).declaration, srcFilePath, path, 'getTime');
    });
});
