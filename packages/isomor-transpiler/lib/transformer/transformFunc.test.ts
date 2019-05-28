import { parse } from '../ast';

import { transformFunc } from './transformFunc';
import { getCodeFunc } from '../code';

jest.mock('../code', () => ({
    getCodeFunc: jest.fn().mockReturnValue('getCodeFuncMock'),
}));

jest.mock('logol');

const path = 'path/to/file';
const withTypes = true;
describe('transformFunc()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should transform function', () => {
        const { program } = parse(`export function getTime(input1: string, input2: number): Promise<string[]> {
            return readdir('./');
        }`);
        const node = transformFunc((program.body[0] as any).declaration, path, withTypes);
        expect(node).toEqual('getCodeFuncMock');
        expect(getCodeFunc).toHaveBeenCalledWith(path, 'getTime', ['input1', 'input2'], withTypes);
    });

    it('should transform function with rest params', () => {
        const { program } = parse(`export function getTime(input1: string, ...input2: number[]): Promise<string[]> {
            return readdir('./');
        }`);
        const node = transformFunc((program.body[0] as any).declaration, path, withTypes);
        expect(node).toEqual('getCodeFuncMock');
        expect(getCodeFunc).toHaveBeenCalledWith(path, 'getTime', [], withTypes);
    });
});
