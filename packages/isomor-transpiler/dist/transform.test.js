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
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const fnOptions = {
        srcFilePath: 'src-isomor/path/to/file',
        path: 'path-to-file',
        wsReg: null,
        pkgName: 'root',
        withTypes: true,
    };
    describe('transform/transform()', () => {
        it('should add isomor import to body', () => {
            const body = [];
            const newBody = transform_1.default([...body], fnOptions);
            expect(newBody).toEqual([getCodeImportMock()]);
        });
        it('should remove node if transformNode return nothing', () => {
            const node = 'node';
            const body = [node];
            const newBody = transform_1.default([...body], fnOptions);
            expect(newBody).toEqual([getCodeImportMock()]);
        });
        it('should keep node if transformNode return the same node', () => {
            const node = 'node';
            transformNode_1.transformNode.mockImplementation().mockReturnValue(node);
            const body = [node];
            const newBody = transform_1.default([...body], fnOptions);
            expect(newBody).toEqual([getCodeImportMock(), node]);
        });
        it('should transform node if transformNode return a different node', () => {
            const node = 'node';
            const anotherNode = 'anotherNode';
            transformNode_1.transformNode.mockImplementation().mockReturnValue(anotherNode);
            const body = [node];
            const newBody = transform_1.default([...body], fnOptions);
            expect(newBody).toEqual([getCodeImportMock(), anotherNode]);
        });
        it('should insert node array', () => {
            const nodeArray = ['ins1', 'ins2', 'ins3'];
            transformNode_1.transformNode.mockImplementation()
                .mockReturnValueOnce(nodeArray)
                .mockReturnValue('node2');
            const body = ['node1', 'node2'];
            const newBody = transform_1.default([...body], fnOptions);
            expect(newBody).toEqual([getCodeImportMock(), ...nodeArray, 'node2']);
        });
    });
});
//# sourceMappingURL=transform.test.js.map