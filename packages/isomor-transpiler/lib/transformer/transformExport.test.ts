import { parse, generate } from '../ast';

import { transformExport } from './transformExport';
import { getCodeType } from '../code';
import { isArray } from 'util';

const transformExportFromCode = (
    source: string,
    noServerImport: boolean = false,
): string => {
    const { program } = parse(source);
    const body = transformExport(program.body[0] as any, noServerImport);
    program.body = isArray(body) ? body : [body];
    const { code } = generate(program as any);
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
        const { program } = parse(`export { CpuInfo, Abc } from './my/import';`);
        const node = transformExport(program.body[0] as any);
        expect(node).toEqual(['getCodeTypeMock', 'getCodeTypeMock']);
        expect(getCodeType).toHaveBeenCalledWith('CpuInfo');
        expect(getCodeType).toHaveBeenCalledWith('Abc');
    });
    it('should transform export to any if noServerImport=true', () => {
        const noServerImport = true;
        const { program } = parse(`export { CpuInfo, Abc } from 'os';`);
        const node = transformExport(program.body[0] as any, noServerImport);
        expect(node).toEqual(['getCodeTypeMock', 'getCodeTypeMock']);
        expect(getCodeType).toHaveBeenCalledWith('CpuInfo');
        expect(getCodeType).toHaveBeenCalledWith('Abc');
    });
});
