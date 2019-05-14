import { parse, generate } from './ast';

import { transformClass } from './transformerClass';
import { getCodeMethod, getCodeConstructor } from './code';
import { JsonAst } from './ast';
import { isArray } from 'util';

jest.mock('./code', () => ({
    getCodeType: jest.fn().mockReturnValue('getCodeTypeMock'),
    getCodeMethod: jest.fn().mockReturnValue({
        type: 'ClassMethod',
        key: {
            type: 'Identifier',
            name: 'mock',
        },
        params: [],
    }),
    getCodeConstructor: jest.fn().mockReturnValue({
        type: 'ClassMethod',
        key: {
            type: 'Identifier',
            name: 'constructorMock',
        },
        params: [],
    }),
}));

const transformClassFromCode = (
    source: string,
    noDecorator: boolean = false,
): string => {
    const withTypes = true;
    const path = 'path/to/somewhere';
    const { program } = parse(source);
    // console.log('JsonAst', JsonAst(program.body[0]));
    const body = transformClass(program.body[0] as any, path, withTypes, noDecorator);
    program.body = isArray(body) ? body : [body];
    // console.log('JsonAst2', JsonAst(program.body[0]));
    const { code } = generate(program as any);
    return code;
};

describe('transformerClass', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // -----------------
    it('should keep class when implement IsomorShare', () => {
        const code =
            `export class Post implements IsomorShare {
  @Length(10, 20)
  title: string;
  @Contains("hello")
  text: string;
}`;
        expect(transformClassFromCode(code)).toBe(code);
    });
    // -----------------
    it('should transform class for isomor when noDecorator is true', () => {
        const code =
            `export class CatsService extends Hello {
                findAll(id: string): Cat[] {
                    return this.cats;
                }

                }`;
        const noDecorator = true;
        expect(transformClassFromCode(code, noDecorator)).toBe(
            `class CatsService__deco_export__ extends Hello {}

export class CatsService extends CatsService__deco_export__ {
  mock()

}`,
        );
        expect(getCodeMethod).toHaveBeenCalledTimes(1); // called with?
    });
    // -----------------
    it('should not transform class when no noDecorator but dont provide @isomor', () => {
        const code =
            `@Injectable()
                export class CatsService extends Hello {
                    findAll(id: string): Cat[] {
                        return this.cats;
                    }
                }`;
        expect(transformClassFromCode(code)).toBe(``);
        expect(getCodeMethod).toHaveBeenCalledTimes(0);
    });
    // -----------------
    it('should transform class for isomor', () => {
        const code =
            `@Injectable()
                @isomor
                export class CatsService extends Hello {
                findAll(id: string): Cat[] {
                    return this.cats;
                }

                }`;
        expect(transformClassFromCode(code)).toBe(
            `@Injectable()
@isomor
class CatsService__deco_export__ extends Hello {}

export class CatsService extends CatsService__deco_export__ {
  mock()

}`,
        );
        expect(getCodeMethod).toHaveBeenCalledTimes(1); // called with?
    });
    // -----------------
    it('should transform class constructor', () => {
        const code =
            `@Injectable()
                @isomor
                export class CatsService {
                    constructor(
                        @InjectRepository(Photo)
                        private readonly photoRepository: Repository<Photo>,
                    ) {}

                }`;
        expect(transformClassFromCode(code)).toBe(
            `@Injectable()
@isomor
class CatsService__deco_export__ {}

export class CatsService extends CatsService__deco_export__ {
  constructorMock()

}`,
        );
        expect(getCodeConstructor).toHaveBeenCalledTimes(1); // called with?
    });
    // -----------------
});
