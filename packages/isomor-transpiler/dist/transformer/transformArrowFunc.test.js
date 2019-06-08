"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const transformArrowFunc_1 = require("./transformArrowFunc");
const code_1 = require("../code");
const validation_1 = require("../validation");
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
        const { program } = ast_1.parse(`export const getTime = (input1: string, input2: number): Promise<string[]> => {
            return readdir('./');
        }`);
        const node = transformArrowFunc_1.transformArrowFunc(program.body[0].declaration, srcFilePath, path, pkgName, withTypes);
        expect(node).toEqual('getCodeArrowFuncMock');
        expect(code_1.getCodeArrowFunc).toHaveBeenCalledWith(path, pkgName, 'getTime', withTypes);
        expect(validation_1.setValidator).toBeCalledWith(program.body[0].declaration.declarations[0].init, srcFilePath, path, 'getTime');
    });
});
//# sourceMappingURL=transformArrowFunc.test.js.map