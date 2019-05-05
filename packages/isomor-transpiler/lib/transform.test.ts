import transform from './transform';
import { transformNode } from './transformNode';

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
            const body = [] as any;
            const newBody = transform([...body], path);
            expect(newBody).toEqual([getCodeImportMock()]);
        });
        it('should remove node if transformNode return nothing', () => {
            const node = 'node';
            const body = [node] as any;
            const newBody = transform([...body], path);
            expect(newBody).toEqual([getCodeImportMock()]);
        });
        it('should keep node if transformNode return the same node', () => {
            const node = 'node';
            (transformNode as jest.Mock).mockImplementation().mockReturnValue(node);
            const body = [node] as any;
            const newBody = transform([...body], path);
            expect(newBody).toEqual([getCodeImportMock(), node]);
        });
        it('should transform node if transformNode return a different node', () => {
            const node = 'node';
            const anotherNode = 'anotherNode';
            (transformNode as jest.Mock).mockImplementation().mockReturnValue(anotherNode);
            const body = [node] as any;
            const newBody = transform([...body], path);
            expect(newBody).toEqual([getCodeImportMock(), anotherNode]);
        });

        it('should insert node array', () => {
            const nodeArray = ['ins1', 'ins2', 'ins3'];
            (transformNode as jest.Mock).mockImplementation()
                                        .mockReturnValueOnce(nodeArray)
                                        .mockReturnValue('node2');
            const body = ['node1', 'node2'] as any;
            const newBody = transform([...body], path);
            expect(newBody).toEqual([getCodeImportMock(), ...nodeArray, 'node2']);
        });
    });
});
