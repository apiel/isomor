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
const isomor_core_1 = require("isomor-core");
const path_1 = require("path");
const logol_1 = require("logol");
const debug_1 = require("debug");
const fs_extra_1 = require("fs-extra");
const chokidar_1 = require("chokidar");
function generateClientJs(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { srcFolder, extensions } = options;
        const files = yield isomor_core_1.getFiles(srcFolder, extensions);
        logol_1.info(`Transpile TS files to JS.`, files);
        yield Promise.all(files.map(transpileFileToJs(options)));
    });
}
exports.generateClientJs = generateClientJs;
function clientWatchForJs(options) {
    const { srcFolder } = options;
    chokidar_1.watch('*.ts', {
        cwd: srcFolder,
        usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
    })
        .on('ready', () => logol_1.info('Watch for TS files to convert to JS...'))
        .on('add', transpileFileToJs(options, logol_1.info))
        .on('change', transpileFileToJs(options, logol_1.info));
}
exports.clientWatchForJs = clientWatchForJs;
const transpileFileToJs = (options, log = (...args) => void 0) => (file) => {
    if (!file.endsWith('.d.ts') && file.endsWith('.ts')) {
        const { moduleFolder } = options;
        const name = path_1.basename(file, path_1.extname(file));
        const moduleJsFile = path_1.join(moduleFolder, `${name}.js`);
        const code = getJsCode(options, name);
        log('Save JS file', moduleJsFile);
        debug_1.default('isomor-transpiler:transpile:out')(code);
        return fs_extra_1.outputFile(moduleJsFile, code);
    }
};
function getJsCode({ wsReg, wsBaseUrl, httpBaseUrl, moduleName }, name) {
    var _a;
    const protocol = ((_a = wsReg) === null || _a === void 0 ? void 0 : _a.test(name)) ? 'ws' : 'http';
    const baseUrl = protocol === 'ws' ? wsBaseUrl : httpBaseUrl;
    return `"use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = _default;

    var _isomor = require("isomor");

    function _default() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (0, _isomor.isomorRemote)("${protocol}", "${baseUrl}", "${moduleName}", "${name}", args);
}`;
}
//# sourceMappingURL=generateClientJs.js.map