"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transform_1 = require("./transform");
const transformNode_1 = require("./transformNode");
function getCodeImportMock() {
    return 'getCodeImportMock';
}
jest.mock('./transformNode');
jest.mock('./code', () => ({
    getCodeImport: jest.fn().mockReturnValue(getCodeImportMock()),
}));
describe('transform', () => {
    const path = 'path/to/file';
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('transform/transform()', () => {
        it('should add isomor import to body', () => {
            const body = [];
            const newBody = transform_1.default([...body], path);
            expect(newBody).toEqual([getCodeImportMock()]);
        });
        it('should remove node if transformNode return nothing', () => {
            const node = 'node';
            const body = [node];
            const newBody = transform_1.default([...body], path);
            expect(newBody).toEqual([getCodeImportMock()]);
        });
        it('should keep node if transformNode return the same node', () => {
            const node = 'node';
            transformNode_1.transformNode.mockImplementation().mockReturnValue(node);
            const body = [node];
            const newBody = transform_1.default([...body], path);
            expect(newBody).toEqual([getCodeImportMock(), node]);
        });
        it('should transform node if transformNode return a different node', () => {
            const node = 'node';
            const anotherNode = 'anotherNode';
            transformNode_1.transformNode.mockImplementation().mockReturnValue(anotherNode);
            const body = [node];
            const newBody = transform_1.default([...body], path);
            expect(newBody).toEqual([getCodeImportMock(), anotherNode]);
        });
    });
});
//# sourceMappingURL=transform.test.js.map