"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const transformType_1 = require("./transformType");
const code_1 = require("../code");
jest.mock('../code', () => ({
    getCodeType: jest.fn().mockReturnValue('getCodeTypeMock'),
}));
describe('transformExport()', () => {
    it('should transform type', () => {
        const { program } = ast_1.parse(`export type MyType = string;`);
        const root = program.body[0].declaration;
        const body = transformType_1.transformType(root);
        expect(body).toEqual('getCodeTypeMock');
        expect(code_1.getCodeType).toHaveBeenCalledWith('MyType');
    });
});
//# sourceMappingURL=transformType.test.js.map