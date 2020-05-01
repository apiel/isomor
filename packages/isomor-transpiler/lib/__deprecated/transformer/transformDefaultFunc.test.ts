import { parse, JsonAst, generate } from '../ast';

import { transformDefaultFunc } from './transformDefaultFunc';
import { setValidator } from '../../validation';

jest.mock('../validation');

jest.mock('logol');

const filename = 'my-filename';
const options = {
    srcFilePath: `src-isomor/path/to/${filename}.ts`,
    moduleName: 'api',
    wsReg: null,
    httpBaseUrl: '',
    wsBaseUrl: 'ws://127.0.0.1:3005',
    declaration: true,
};

export const source = `export default function(input1: string, input2: number): Promise<string[]> {
    return readdir('./');
}`;

export const transpiled = `export default function (...args: any) {
  return isomorRemote("http", "", "path-to-my-filename", "root", "${filename}", args);
}`;

// path-to-file should not be necessary anymore
export const transpiledDeclaration = `export default function (input1: string, input2: number): Promise<string[]> {
  return (undefined as any);
}`;

describe('transformDefaultFunc()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should transform default function', () => {
        const { program } = parse(source);

        const node = transformDefaultFunc(
            (program.body[0] as any).declaration,
            options,
        );

        program.body[0] = node;
        const { code } = generate(program as any);
        expect(code).toEqual(transpiled);
    });

    it('should transform default function for declaration', () => {
        const { program } = parse(source);

        const node = transformDefaultFunc(
            (program.body[0] as any).declaration,
            { ...options, declaration: true },
        );

        program.body[0] = node;
        const { code } = generate(program as any);
        expect(code).toEqual(transpiledDeclaration);
    });
});
