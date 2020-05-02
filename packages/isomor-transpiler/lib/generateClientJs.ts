import { Options } from 'isomor-core';
import { join, basename, extname } from 'path';
import { info } from 'logol';
import debug from 'debug';
import { outputFile } from 'fs-extra';

export function generateClientJs(options: Options, file: string) {
    const { moduleFolder } = options;
    const name = basename(file, extname(file));
    const moduleJsFile = join(moduleFolder, `${name}.js`);
    const code = getJsCode(options, name);
    info('Save isomor JS file', moduleJsFile);
    debug('isomor-transpiler:transpile:out')(code);
    return outputFile(moduleJsFile, code);
}

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
