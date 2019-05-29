"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const transformArrowFunc_1 = require("./transformArrowFunc");
const code_1 = require("../code");
const getArgs_1 = require("./utils/getArgs");
jest.mock('./utils/getArgs', () => ({
    getArgs: jest.fn().mockReturnValue(['input1', 'input2']),
}));
jest.mock('../code', () => ({
    getCodeArrowFunc: jest.fn().mockReturnValue('getCodeArrowFuncMock'),
}));
jest.mock('logol');
const srcFilePath = 'src-isomor/path/to/file';
const path = 'path-to-file';
const withTypes = true;
describe('transformFunc()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should transform arrow function', () => {
        const { program } = ast_1.parse(`export const getTime = (input1: string, input2: number): Promise<string[]> => {
            return readdir('./');
        }`);
        const node = transformArrowFunc_1.transformArrowFunc(program.body[0].declaration, srcFilePath, path, withTypes);
        expect(node).toEqual('getCodeArrowFuncMock');
        expect(code_1.getCodeArrowFunc).toHaveBeenCalledWith(path, 'getTime', ['input1', 'input2'], withTypes);
        expect(getArgs_1.getArgs).toBeCalledWith(program.body[0].declaration.declarations[0].init, srcFilePath, path, 'getTime');
    });
});
//# sourceMappingURL=transformArrowFunc.test.js.map