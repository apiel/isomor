import { parse, generate } from '../ast';

import { transformClass } from './transformClass';
import { getCodeMethod, getCodeConstructor } from '../code';
import { JsonAst } from '../ast';
import { isArray } from 'util';

jest.mock('../validation');

jest.mock('../code', () => ({
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

const withTypes = true;
const srcFilePath = 'src-isomor/path/to/file';
const path = 'path-to-file';
const pkgName = 'root';

const transformClassFromCode = (
    source: string,
    noDecorator: boolean = false,
): string => {
    const { program } = parse(source);
    // console.log('JsonAst', JsonAst(program.body[0]));
    const body = transformClass(program.body[0] as any, srcFilePath, path, pkgName, withTypes, noDecorator);
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
    it('should keep class as it is when implement IsomorShare', () => {
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
    it('should keep class as it is when @isomorShare is defined', () => {
        expect(transformClassFromCode(`@isomorShare
        export class Post {
          @Length(10, 20)
          title: string;
          @Contains("hello")
          text: string;
        }`)).toBe(`@isomorShare
class Post__deco_export__ {}

export class Post extends Post__deco_export__ {
  @Length(10, 20)
  title: string;
  @Contains("hello")
  text: string;
}`);
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
        expect(getCodeMethod).toHaveBeenCalledWith(path, pkgName, 'findAll', 'CatsService', withTypes);
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
