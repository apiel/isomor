"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const folderToSearch = 'server';
const rootFolder = '../test';
const foldersServer = [
    path_1.join('foo', folderToSearch),
    folderToSearch,
];
const filesServer = foldersServer.map(folder => path_1.join(folder, 'data.ts'));
const filesApp = [
    'page1.tsx',
    path_1.join('foo', 'page2.tsx'),
];
function generateTests() {
    return Promise.all([...filesServer, ...filesApp].map(file => fs_extra_1.outputFile(path_1.join(rootFolder, file), '// test')));
}
function destroyTests() {
    return fs_extra_1.remove(rootFolder);
}
describe('index', () => {
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield destroyTests();
    }));
    describe('getJsonSchemaFileName()', () => {
        it('should return json validation file name', () => {
            expect(_1.getJsonSchemaFileName('path', 'name'))
                .toEqual(`path.name.json`);
            expect(_1.getJsonSchemaFileName('path', 'name', 'className'))
                .toEqual(`path.className.name.json`);
        });
    });
    describe('getFilesPattern()', () => {
        it('should return search pattern', () => {
            expect(_1.getFilesPattern(folderToSearch))
                .toEqual(`**/${folderToSearch}/*`);
        });
    });
    describe('getPathForUrl()', () => {
        it('should transform a path to an url slug', () => {
            expect(_1.getPathForUrl('/foo/bar/hello-world/file.ts'))
                .toEqual(`foo-bar-hello-world-file`);
            expect(_1.getPathForUrl('/foo/bar/hello-world/'))
                .toEqual(`foo-bar-hello-world`);
        });
    });
    describe('getFiles()', () => {
        it('should return an empty array if files does not exist', () => __awaiter(this, void 0, void 0, function* () {
            const files = yield _1.getFiles(rootFolder, folderToSearch);
            expect(files).toEqual([]);
        }));
        it('should return server files', () => __awaiter(this, void 0, void 0, function* () {
            yield generateTests();
            const files = yield _1.getFiles(rootFolder, folderToSearch);
            expect(files).toEqual(filesServer);
            const files2 = yield _1.getFiles(path_1.join(process.cwd(), rootFolder), folderToSearch);
            expect(files2).toEqual(filesServer);
        }));
    });
    describe('getFolders()', () => {
        it('should return an empty array if folder does not exist', () => __awaiter(this, void 0, void 0, function* () {
            const folders = yield _1.getFolders(rootFolder, folderToSearch);
            expect(folders).toEqual([]);
        }));
        it('should return server folders', () => __awaiter(this, void 0, void 0, function* () {
            yield generateTests();
            const folders = yield _1.getFolders(rootFolder, folderToSearch);
            expect(folders).toEqual(foldersServer);
            const folders2 = yield _1.getFolders(path_1.join(process.cwd(), rootFolder), folderToSearch);
            expect(folders2).toEqual(foldersServer);
        }));
    });
});
//# sourceMappingURL=index.test.js.map