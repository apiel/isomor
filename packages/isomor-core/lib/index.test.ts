import { getFiles, getJsonSchemaFileName } from '.';
import { outputFile, remove } from 'fs-extra';
import { join } from 'path';

const rootFolder = '../test';

const filesToFind = [
    'file.js',
    'file.ts',
]

const filesApp = [
    ...filesToFind,
    'tsconfig.json',
    join('foo', 'file.ts'),
];

function generateTests() {
    return Promise.all(
        filesApp.map(
            file => outputFile(join(rootFolder, file), '// test'),
        ),
    );
}

function destroyTests() {
    return remove(rootFolder);
}

describe('index', () => {
    afterEach(async () => {
        await destroyTests();
    });

    beforeEach(async () => {
        await destroyTests();
    });

    describe('getJsonSchemaFileName()', () => {
        it('should return json validation file name', () => {
            expect(getJsonSchemaFileName('path', 'name'))
                .toEqual(`path.name.json`);
        });
    });

    describe('getFiles()', () => {
        it('should return an empty array if files does not exist', async () => {
            const files = await getFiles(rootFolder, ['.js', '.ts']);
            expect(files).toEqual([]);
        });
        it('should return server files', async () => {
            await generateTests();
            const files = await getFiles(rootFolder, ['.js', '.ts']);
            expect(files).toEqual(filesToFind);
        });
    });
});
