import generate from '@babel/generator';
import { parse } from '@typescript-eslint/typescript-estree';

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
    });
});
