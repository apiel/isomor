"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const transformExport_1 = require("./transformExport");
const code_1 = require("../code");
const util_1 = require("util");
const transformExportFromCode = (source, noServerImport = false) => {
    const { program } = ast_1.parse(source);
    const body = transformExport_1.transformExport(program.body[0], noServerImport);
    program.body = util_1.isArray(body) ? body : [body];
    const { code } = ast_1.generate(program);
    return code;
};
jest.mock('../code', () => ({
    getCodeType: jest.fn().mockReturnValue('getCodeTypeMock'),
}));
describe('transformExport()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should transform keep export', () => {
        expect(transformExportFromCode(`export { CpuInfo } from 'os';`))
            .toBe(`export { CpuInfo } from 'os';`);
    });
    it('should transform locale export', () => {
        const { program } = ast_1.parse(`export { CpuInfo, Abc } from './my/import';`);
        const node = transformExport_1.transformExport(program.body[0]);
        expect(node).toEqual(['getCodeTypeMock', 'getCodeTypeMock']);
        expect(code_1.getCodeType).toHaveBeenCalledWith('CpuInfo');
        expect(code_1.getCodeType).toHaveBeenCalledWith('Abc');
    });
    it('should transform export to any if noServerImport=true', () => {
        const noServerImport = true;
        const { program } = ast_1.parse(`export { CpuInfo, Abc } from 'os';`);
        const node = transformExport_1.transformExport(program.body[0], noServerImport);
        expect(node).toEqual(['getCodeTypeMock', 'getCodeTypeMock']);
        expect(code_1.getCodeType).toHaveBeenCalledWith('CpuInfo');
        expect(code_1.getCodeType).toHaveBeenCalledWith('Abc');
    });
});
//# sourceMappingURL=transformExport.test.js.map