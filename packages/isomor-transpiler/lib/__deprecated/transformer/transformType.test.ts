import { parse } from '../ast';

import { transformType } from './transformType';
import { getCodeType } from '../code';

jest.mock('../code', () => ({
    getCodeType: jest.fn().mockReturnValue('getCodeTypeMock'),
}));

describe('transformExport()', () => {
    it('should transform type', () => {
        const { program } = parse(`export type MyType = string;`);
        const root = (program.body[0] as any).declaration;
        const body = transformType(root);
        expect(body).toEqual('getCodeTypeMock');
        expect(getCodeType).toHaveBeenCalledWith('MyType');
    });
});
