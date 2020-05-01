"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const rootFolder = '../test';
const filesToFind = [
    'file.js',
    'file.ts',
];
const filesApp = [
    ...filesToFind,
    'tsconfig.json',
    path_1.join('foo', 'file.ts'),
];
function generateTests() {
    return Promise.all(filesApp.map(file => fs_extra_1.outputFile(path_1.join(rootFolder, file), '// test')));
}
function destroyTests() {
    return fs_extra_1.remove(rootFolder);
}
describe('index', () => {
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield destroyTests();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield destroyTests();
    }));
    describe('getJsonSchemaFileName()', () => {
        it('should return json validation file name', () => {
            expect(_1.getJsonSchemaFileName('path', 'name'))
                .toEqual(`path.name.json`);
        });
    });
    describe('getFiles()', () => {
        it('should return an empty array if files does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const files = yield _1.getFiles(rootFolder, ['.js', '.ts']);
            expect(files).toEqual([]);
        }));
        it('should return server files', () => __awaiter(void 0, void 0, void 0, function* () {
            yield generateTests();
            const files = yield _1.getFiles(rootFolder, ['.js', '.ts']);
            expect(files).toEqual(filesToFind);
        }));
    });
});
//# sourceMappingURL=index.test.js.map