"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const transformFunc_1 = require("./transformFunc");
const code_1 = require("../code");
const validation_1 = require("../validation");
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
        const { program } = ast_1.parse(`export function getTime(input1: string, input2: number): Promise<string[]> {
            return readdir('./');
        }`);
        const node = transformFunc_1.transformFunc(program.body[0].declaration, srcFilePath, path, withTypes);
        expect(node).toEqual('getCodeFuncMock');
        expect(code_1.getCodeFunc).toHaveBeenCalledWith(path, 'getTime', withTypes);
        expect(validation_1.setValidator).toBeCalledWith(program.body[0].declaration, srcFilePath, path, 'getTime');
    });
});
//# sourceMappingURL=transformFunc.test.js.map