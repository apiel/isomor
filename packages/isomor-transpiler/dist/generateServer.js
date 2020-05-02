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
const logol_1 = require("logol");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const shell_1 = require("./shell");
function generateServer(options) {
    return __awaiter(this, void 0, void 0, function* () {
        yield generateServerWithBabel(options);
    });
}
exports.generateServer = generateServer;
function generateServerWithBabel({ serverFolder, srcFolder, }) {
    return __awaiter(this, void 0, void 0, function* () {
        logol_1.info('Transpile server with babel');
        const balelFile = '.babelrc.json';
        const babelPath = path_1.join(srcFolder, balelFile);
        if (!(yield fs_extra_1.pathExists(babelPath))) {
            const babelConfig = {
                presets: ['@babel/preset-typescript', '@babel/preset-env'],
            };
            yield fs_extra_1.outputJson(babelPath, babelConfig);
        }
        console.log('yyo', `${srcFolder} --outDir ${serverFolder} --extensions ".ts" --config-file ${babelPath}`);
        return shell_1.shell('babel', `${srcFolder} --outDir ${serverFolder} --extensions ".ts" --config-file ${babelPath}`.split(' '));
    });
}
exports.generateServerWithBabel = generateServerWithBabel;
function generateServerWithTsc({ serverFolder, srcFolder, }) {
    return __awaiter(this, void 0, void 0, function* () {
        logol_1.info('Transpile server with tsc');
        const tsConfigFile = 'tsconfig.json';
        const tsConfigPath = path_1.join(srcFolder, tsConfigFile);
        if (!(yield fs_extra_1.pathExists(tsConfigPath))) {
            const tsconfig = {
                compilerOptions: {
                    types: ['node'],
                    module: 'commonjs',
                    declaration: false,
                    removeComments: true,
                    emitDecoratorMetadata: true,
                    experimentalDecorators: true,
                    target: 'es6',
                    sourceMap: false,
                },
            };
            yield fs_extra_1.outputJson(tsConfigPath, tsconfig);
        }
        return shell_1.shell('tsc', `--outDir ${serverFolder} -p ${tsConfigFile}`.split(' '), srcFolder);
    });
}
exports.generateServerWithTsc = generateServerWithTsc;
//# sourceMappingURL=generateServer.js.map