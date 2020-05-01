"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const transformDefaultFunc_1 = require("./transformDefaultFunc");
jest.mock('../validation');
jest.mock('logol');
const filename = 'my-filename';
const options = {
    srcFilePath: `src-isomor/path/to/${filename}.ts`,
    moduleName: 'api',
    wsReg: null,
    httpBaseUrl: '',
    wsBaseUrl: 'ws://127.0.0.1:3005',
    declaration: true,
};
exports.source = `export default function(input1: string, input2: number): Promise<string[]> {
    return readdir('./');
}`;
exports.transpiled = `export default function (...args: any) {
  return isomorRemote("http", "", "path-to-my-filename", "root", "${filename}", args);
}`;
exports.transpiledDeclaration = `export default function (input1: string, input2: number): Promise<string[]> {
  return (undefined as any);
}`;
describe('transformDefaultFunc()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should transform default function', () => {
        const { program } = ast_1.parse(exports.source);
        const node = transformDefaultFunc_1.transformDefaultFunc(program.body[0].declaration, options);
        program.body[0] = node;
        const { code } = ast_1.generate(program);
        expect(code).toEqual(exports.transpiled);
    });
    it('should transform default function for declaration', () => {
        const { program } = ast_1.parse(exports.source);
        const node = transformDefaultFunc_1.transformDefaultFunc(program.body[0].declaration, Object.assign(Object.assign({}, options), { declaration: true }));
        program.body[0] = node;
        const { code } = ast_1.generate(program);
        expect(code).toEqual(exports.transpiledDeclaration);
    });
});
//# sourceMappingURL=transformDefaultFunc.test.js.map