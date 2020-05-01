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
const chalk_1 = require("chalk");
const spawn = require("cross-spawn");
const core_1 = require("@babel/core");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const debug_1 = require("debug");
const isomor_core_1 = require("isomor-core");
const ast_1 = require("./ast");
const transform_1 = require("./transform");
exports.default = transform_1.default;
function getCode(options, srcFilePath, content, declaration) {
    const { wsReg, wsBaseUrl, httpBaseUrl, moduleName } = options;
    const { program } = ast_1.parse(content);
    const fnOptions = {
        srcFilePath,
        wsReg,
        moduleName,
        wsBaseUrl,
        httpBaseUrl,
        declaration,
    };
    program.body = transform_1.default(program.body, fnOptions);
    const { code } = ast_1.generate(program);
    return code;
}
function transpile(options, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const { moduleFolder, srcFolder, moduleName } = options;
        logol_1.info('Transpile', filePath);
        const srcFilePath = path_1.join(srcFolder, filePath);
        const buffer = yield fs_extra_1.readFile(srcFilePath);
        debug_1.default('isomor-transpiler:transpile:in')(buffer.toString());
        const moduleTsFile = path_1.join(moduleFolder, moduleName, filePath);
        const codeTs = getCode(options, srcFilePath, buffer.toString(), true);
        logol_1.info('Save isomor TS file', moduleTsFile);
        yield fs_extra_1.outputFile(moduleTsFile, codeTs);
        debug_1.default('isomor-transpiler:transpile:out')(codeTs);
        const codeJs = getCode(options, srcFilePath, buffer.toString(), false);
        const { code } = yield core_1.transformAsync(codeJs, {
            filename: filePath,
            presets: ['@babel/preset-typescript', '@babel/preset-env'],
        });
        const moduleJsFile = path_1.join(path_1.dirname(moduleTsFile), path_1.basename(moduleTsFile, path_1.extname(moduleTsFile)) + '.js');
        logol_1.info('Save isomor JS file', moduleJsFile);
        yield fs_extra_1.outputFile(moduleJsFile, code);
        debug_1.default('isomor-transpiler:transpile:out')(code);
    });
}
function prepare(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { jsonSchemaFolder, serverFolder, moduleFolder, extensions, } = options;
        logol_1.info('Prepare folders');
        yield fs_extra_1.emptyDir(jsonSchemaFolder);
        yield fs_extra_1.emptyDir(serverFolder);
        const files = yield isomor_core_1.getFiles(moduleFolder, extensions);
        yield Promise.all(files.map((file) => fs_extra_1.unlink(path_1.join(moduleFolder, file))));
    });
}
function runTsc({ serverFolder, srcFolder }) {
    return __awaiter(this, void 0, void 0, function* () {
        logol_1.info('Transpile server');
        const tsConfigFile = path_1.join(srcFolder, 'tsconfig.json');
        if (!(yield fs_extra_1.pathExists(tsConfigFile))) {
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
            yield fs_extra_1.outputJson(tsConfigFile, tsconfig);
        }
        return shell('tsc', `--outDir ${serverFolder} -p tsconfig.json`.split(' '), srcFolder);
    });
}
function build(options) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prepare(options);
        logol_1.info('Start transpiling', options.moduleName);
        const { srcFolder, extensions, skipBuildServer } = options;
        const files = yield isomor_core_1.getFiles(srcFolder, extensions);
        logol_1.info(`Found ${files.length} file(s).`);
        yield Promise.all(files.map((file) => transpile(options, file)));
        if (!skipBuildServer) {
            yield runTsc(options);
        }
    });
}
exports.build = build;
function shell(command, args, cwd = process.cwd(), env) {
    logol_1.log('Run shell cmd', { cmd: `${command} ${args.join(' ')}`, cwd });
    return new Promise((resolve) => {
        const cmd = spawn(command, args, {
            cwd,
            env: Object.assign(Object.assign({ COLUMNS: process.env.COLUMNS || process.stdout.columns.toString(), LINES: process.env.LINES || process.stdout.rows.toString() }, env), process.env),
        });
        cmd.stdout.on('data', (data) => {
            process.stdout.write(chalk_1.gray(data.toString()));
        });
        cmd.stderr.on('data', (data) => {
            const dataStr = data.toString();
            if (dataStr.indexOf('warning') === 0) {
                process.stdout.write(chalk_1.yellow('warming') + dataStr.substring(7));
            }
            else {
                process.stdout.write(chalk_1.red(data.toString()));
            }
        });
        cmd.on('close', (code) => (code ? process.exit(code) : resolve()));
    });
}
//# sourceMappingURL=build.js.map