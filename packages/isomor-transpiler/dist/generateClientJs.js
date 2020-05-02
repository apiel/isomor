"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const logol_1 = require("logol");
const debug_1 = require("debug");
const fs_extra_1 = require("fs-extra");
function generateClientJs(options, file) {
    const { moduleFolder } = options;
    const name = path_1.basename(file, path_1.extname(file));
    const moduleJsFile = path_1.join(moduleFolder, `${name}.js`);
    const code = getJsCode(options, name);
    logol_1.info('Save isomor JS file', moduleJsFile);
    debug_1.default('isomor-transpiler:transpile:out')(code);
    return fs_extra_1.outputFile(moduleJsFile, code);
}
exports.generateClientJs = generateClientJs;
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