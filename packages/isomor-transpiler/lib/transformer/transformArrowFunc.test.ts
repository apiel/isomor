import { parse } from '../ast';

import { transformArrowFunc } from './transformArrowFunc';
import { getCodeArrowFunc } from '../code';
import { getArgs } from './utils/getArgs';

jest.mock('./utils/getArgs', () => ({
    getArgs: jest.fn().mockReturnValue(['input1', 'input2']),
}));

jest.mock('../code', () => ({
    getCodeArrowFunc: jest.fn().mockReturnValue('getCodeArrowFuncMock'),
}));

jest.mock('logol');

const path = 'path/to/file';
const withTypes = true;
describe('transformFunc()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should transform arrow function', () => {
        const { program } = parse(`export const getTime = (input1: string, input2: number): Promise<string[]> => {
            return readdir('./');
        }`);
        const node = transformArrowFunc((program.body[0] as any).declaration, path, withTypes);
        expect(node).toEqual('getCodeArrowFuncMock');
        expect(getCodeArrowFunc).toHaveBeenCalledWith(path, 'getTime', ['input1', 'input2'], withTypes);
        expect(getArgs).toBeCalledWith((program.body[0] as any).declaration.declarations[0].init, path, 'getTime');
    });
});
