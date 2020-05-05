import { Options, getFiles } from 'isomor-core';
import { join, basename, extname } from 'path';
import { info } from 'logol';
import debug from 'debug';
import { outputFile } from 'fs-extra';
import { watch } from 'chokidar';
import { updateTsFileInSrc, updateJsFileInSrc } from './event';

export async function generateClientJs(options: Options) {
    const { srcFolder, extensions } = options;
    const files = await getFiles(srcFolder, extensions);
    info(`Transpile TS files to JS.`, files);
    await Promise.all(files.map(transpileFileToJs(options)));
}

export function clientWatchForJs(options: Options) {
    const { srcFolder } = options;
    watch('*.ts|*.js', {
        cwd: srcFolder,
        usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
    })
        .on('ready', () => info('Watch for files to generate to JS client...'))
        .on('add', transpileFileToJs(options, info))
        .on('change', transpileFileToJs(options, info));
}

const transpileFileToJs = (
    options: Options,
    log = (...args: any[]) => void 0,
) => (file: string) => {
    if (
        (!file.endsWith('.d.ts') && file.endsWith('.ts')) ||
        file.endsWith('.js')
    ) {
        const { moduleFolder, srcFolder } = options;
        if (file.endsWith('.ts')) {
            updateTsFileInSrc(join(srcFolder, file));
        } else {
            updateJsFileInSrc(join(srcFolder, file));
        }
        const name = basename(file, extname(file));
        const moduleJsFile = join(moduleFolder, `${name}.js`);
        const code = getJsCode(options, name);
        log('Save JS file', moduleJsFile);
        debug('isomor-transpiler:transpile:out')(code);
        return outputFile(moduleJsFile, code);
    }
};

function getJsCode(
    { wsReg, wsBaseUrl, httpBaseUrl, moduleName }: Options,
    name: string,
) {
    const protocol = wsReg?.test(name) ? 'ws' : 'http';
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
