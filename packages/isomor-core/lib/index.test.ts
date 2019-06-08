import { getFilesPattern, getPathForUrl, getFiles, getFolders, getJsonSchemaFileName } from '.';
import { outputFile, remove } from 'fs-extra';
import { join } from 'path';

const folderToSearch = 'server';
const rootFolder = '../test';

const foldersServer = [
    join('foo', folderToSearch),
    folderToSearch,
];
const filesServer = foldersServer.map(folder => join(folder, 'data.ts'));
const filesApp = [
    'page1.tsx',
    join('foo', 'page2.tsx'),
];

function generateTests() {
    return Promise.all(
        [...filesServer, ...filesApp].map(
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

    describe('getJsonSchemaFileName()', () => {
        it('should return json validation file name', () => {
            expect(getJsonSchemaFileName('path', 'name'))
                .toEqual(`path.name.json`);
            expect(getJsonSchemaFileName('path', 'name', 'className'))
                .toEqual(`path.className.name.json`);
        });
    });

    describe('getFilesPattern()', () => {
        it('should return search pattern', () => {
            expect(getFilesPattern(folderToSearch))
                .toEqual(`**/${folderToSearch}/*`);
        });
    });

    describe('getPathForUrl()', () => {
        it('should transform a path to an url slug', () => {
            expect(getPathForUrl('/foo/bar/hello-world/file.ts'))
                .toEqual(`foo-bar-hello-world-file`);
            expect(getPathForUrl('/foo/bar/hello-world/'))
                .toEqual(`foo-bar-hello-world`);
        });
    });

    describe('getFiles()', () => {
        it('should return an empty array if files does not exist', async () => {
            const files = await getFiles(rootFolder, folderToSearch);
            expect(files).toEqual([]);
        });
        it('should return server files', async () => {
            await generateTests();
            const files = await getFiles(rootFolder, folderToSearch);
            expect(files).toEqual(filesServer);

            const files2 = await getFiles(join(process.cwd(), rootFolder), folderToSearch);
            expect(files2).toEqual(filesServer);
        });
    });

    describe('getFolders()', () => {
        it('should return an empty array if folder does not exist', async () => {
            const folders = await getFolders(rootFolder, folderToSearch);
            expect(folders).toEqual([]);
        });
        it('should return server folders', async () => {
            await generateTests();
            const folders = await getFolders(rootFolder, folderToSearch);
            expect(folders).toEqual(foldersServer);

            const folders2 = await getFolders(join(process.cwd(), rootFolder), folderToSearch);
            expect(folders2).toEqual(foldersServer);
        });
    });
});
