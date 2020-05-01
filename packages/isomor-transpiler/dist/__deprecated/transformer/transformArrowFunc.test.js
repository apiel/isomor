"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const transformArrowFunc_1 = require("./transformArrowFunc");
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
const filename = 'my-filename';
const options = {
    srcFilePath: `src-isomor/path/to/${filename}.ts`,
    moduleName: 'api',
    wsReg: null,
    httpBaseUrl: '',
    wsBaseUrl: 'ws://127.0.0.1:3005',
    declaration: true,
};
describe('transformFunc()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should transform arrow function', () => {
        const { program } = ast_1.parse(`export const getTime = (input1: string, input2: number): Promise<string[]> => {
            return readdir('./');
        }`);
        const node = transformArrowFunc_1.transformArrowFunc(program.body[0].declaration, options);
    });
});
//# sourceMappingURL=transformArrowFunc.test.js.map