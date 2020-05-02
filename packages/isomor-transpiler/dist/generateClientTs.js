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
const path_1 = require("path");
const logol_1 = require("logol");
const fs_extra_1 = require("fs-extra");
const glob = require("glob");
const util_1 = require("util");
const shell_1 = require("./shell");
const globAsync = util_1.promisify(glob);
function generateClientTs(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { srcFolder } = options;
        const tsFiles = yield globAsync('**/*.ts', { cwd: srcFolder });
        if (tsFiles.length) {
            yield generateDeclarationWithTsc(options);
        }
    });
}
exports.generateClientTs = generateClientTs;
function generateDeclarationWithTsc({ moduleFolder, srcFolder, }) {
    return __awaiter(this, void 0, void 0, function* () {
        logol_1.info('Generate client d.ts file with tsc');
        const tsConfigFile = 'tsconfig.d.json';
        const tsConfigPath = path_1.join(srcFolder, tsConfigFile);
        if (!(yield fs_extra_1.pathExists(tsConfigPath))) {
            const tsconfig = {
                compilerOptions: {
                    types: ['node'],
                    module: 'commonjs',
                    declaration: true,
                    experimentalDecorators: true,
                    emitDeclarationOnly: true,
                    target: 'es6',
                },
            };
            yield fs_extra_1.outputJson(tsConfigPath, tsconfig);
        }
        return shell_1.shell('tsc', `--outDir ${moduleFolder} -p ${tsConfigFile}`.split(' '), srcFolder);
    });
}
//# sourceMappingURL=generateClientTs.js.map