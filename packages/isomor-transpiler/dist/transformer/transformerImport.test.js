"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const transformerImport_1 = require("./transformerImport");
const util_1 = require("util");
const transformImportFromCode = (source, noServerImport = false) => {
    const { program } = ast_1.parse(source);
    const body = transformerImport_1.transformImport(program.body[0], noServerImport);
    program.body = util_1.isArray(body) ? body : [body];
    const { code } = ast_1.generate(program);
    return code;
};
describe('transformImport()', () => {
    it('should keep import', () => {
        expect(transformImportFromCode(`import { readdir } from 'fs-extra';`)).toBe(`import { readdir } from 'fs-extra';`);
    });
    it('should remove import if noServerImport is true', () => {
        const noServerImport = true;
        expect(transformImportFromCode(`import { readdir } from 'fs-extra';`, noServerImport)).toBe(``);
    });
    it('should transform server import to browser import', () => {
        expect(transformImportFromCode(`import { Injectable } from '@nestjs/common'; // > import { Injectable } from '@angular/core';`))
            .toBe(`import { Injectable } from '@angular/core';`);
    });
    it('should remove locale import', () => {
        expect(transformImportFromCode(`import { something } from './my/import';`)).toBe('');
    });
    it('should remove import if // >', () => {
        expect(transformImportFromCode(`import { Injectable } from '@nestjs/common'; // >`))
            .toBe(``);
    });
});
//# sourceMappingURL=transformerImport.test.js.map