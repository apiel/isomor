import { parse, generate } from '../ast';

import { transformImport } from './transformerImport';
import { JsonAst } from '../ast';
import { isArray } from 'util';

const transformImportFromCode = (
    source: string,
    noServerImport: boolean = false,
): string => {
    const { program } = parse(source);
    const body = transformImport(program.body[0] as any, noServerImport);
    program.body = isArray(body) ? body : [body];
    const { code } = generate(program as any);
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
