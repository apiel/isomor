import { getFilesPattern, getPathForUrl, getFiles } from '.';
import { outputFile, rmdir } from 'fs-extra';
import { join } from 'path';

const folderToSearch = '/server';
const rootFolder = './test';

const filesServer = [
    join(rootFolder, folderToSearch, 'data.ts'),
    join(rootFolder, 'foo', folderToSearch, 'data.ts'),
];
const filesApp = [
    join(rootFolder, 'page.tsx'),
    join(rootFolder, 'foo', 'page.tsx'),
];

function generateTests() {
    // return Promise.all(
    //     [...filesServer, ...filesApp].map(
    //         file => outputFile(file, '// test'),
    //     ),
    // );
}

function destroyTests() {
    // return rmdir(rootFolder);
}

describe('index', () => {
    afterEach(async () => {
        await destroyTests();
    });

    describe('getFilesPattern()', () => {
        it('should return search pattern', () => {
            expect(getFilesPattern(folderToSearch))
                .toEqual(`**${folderToSearch}/*`);
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
        it('should return an empty string if folder does not exist', async () => {
            const files = await getFiles(rootFolder, folderToSearch);
            expect(files).toEqual([]);
        });
        it('should return server files', async () => {
            await generateTests();
            const files = await getFiles(rootFolder, folderToSearch);
            expect(files).toEqual(filesServer);
        });
    });
});
