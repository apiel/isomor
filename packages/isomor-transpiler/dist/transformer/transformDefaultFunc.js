"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const code_1 = require("../code");
function transformDefaultFunc(root, _a) {
    var { srcFilePath, declaration } = _a, bodyParams = __rest(_a, ["srcFilePath", "declaration"]);
    const name = path_1.basename(srcFilePath, path_1.extname(srcFilePath));
    if (declaration) {
        root.body = code_1.getBodyEmptyReturn();
        return {
            type: 'ExportDefaultDeclaration',
            declaration: root,
        };
    }
    return code_1.getCodeFunc({
        bodyParams: Object.assign({ name }, bodyParams),
    });
}
exports.transformDefaultFunc = transformDefaultFunc;
//# sourceMappingURL=transformDefaultFunc.js.map