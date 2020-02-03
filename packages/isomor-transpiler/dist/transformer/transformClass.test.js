"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../ast");
const transformClass_1 = require("./transformClass");
const code_1 = require("../code");
const util_1 = require("util");
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
const wsReg = null;
const httpBaseUrl = '';
const wsBaseUrl = 'ws://127.0.0.1:3005';
const transformClassFromCode = (source, noDecorator = false) => {
    const { program } = ast_1.parse(source);
    const body = transformClass_1.transformClass(program.body[0], { srcFilePath, wsReg, path, pkgName, withTypes, httpBaseUrl, wsBaseUrl }, noDecorator);
    program.body = util_1.isArray(body) ? body : [body];
    const { code } = ast_1.generate(program);
    return code;
};
describe('transformerClass', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should keep class as it is when implement IsomorShare', () => {
        const code = `export class Post implements IsomorShare {
  @Length(10, 20)
  title: string;
  @Contains("hello")
  text: string;
}`;
        expect(transformClassFromCode(code)).toBe(code);
    });
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
    it('should transform class for isomor when noDecorator is true', () => {
        const code = `export class CatsService extends Hello {
                findAll(id: string): Cat[] {
                    return this.cats;
                }
            }`;
        const noDecorator = true;
        expect(transformClassFromCode(code, noDecorator)).toBe(`class CatsService__deco_export__ extends Hello {}

export class CatsService extends CatsService__deco_export__ {
  mock()

}`);
        expect(code_1.getCodeMethod).toHaveBeenCalledTimes(1);
        expect(code_1.getCodeMethod).toHaveBeenCalledWith({
            withTypes,
            bodyParams: { wsReg, path, pkgName, name: 'findAll', className: 'CatsService', httpBaseUrl, wsBaseUrl },
        });
    });
    it('should not transform class when no noDecorator but dont provide @isomor', () => {
        const code = `@Injectable()
                export class CatsService extends Hello {
                    findAll(id: string): Cat[] {
                        return this.cats;
                    }
                }`;
        expect(transformClassFromCode(code)).toBe(``);
        expect(code_1.getCodeMethod).toHaveBeenCalledTimes(0);
    });
    it('should transform class for isomor', () => {
        const code = `@Injectable()
            @isomor
            export class CatsService extends Hello {
                findAll(id: string): Cat[] {
                    return this.cats;
                }
            }`;
        expect(transformClassFromCode(code)).toBe(`@Injectable()
@isomor
class CatsService__deco_export__ extends Hello {}

export class CatsService extends CatsService__deco_export__ {
  mock()

}`);
        expect(code_1.getCodeMethod).toHaveBeenCalledTimes(1);
    });
    it('should transform class constructor', () => {
        const code = `@Injectable()
                @isomor
                export class CatsService {
                    constructor(
                        @InjectRepository(Photo)
                        private readonly photoRepository: Repository<Photo>,
                    ) {}

                }`;
        expect(transformClassFromCode(code)).toBe(`@Injectable()
@isomor
class CatsService__deco_export__ {}

export class CatsService extends CatsService__deco_export__ {
  constructorMock()

}`);
        expect(code_1.getCodeConstructor).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=transformClass.test.js.map