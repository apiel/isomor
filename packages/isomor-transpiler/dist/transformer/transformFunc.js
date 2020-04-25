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
const code_1 = require("../code");
const validation_1 = require("../validation");
function transformFunc(root, _a) {
    var { srcFilePath, path, withTypes } = _a, bodyParams = __rest(_a, ["srcFilePath", "path", "withTypes"]);
    const { name } = root.id;
    validation_1.setValidator(root, srcFilePath, path, name);
    root.body = code_1.getBody(Object.assign({ path, name }, bodyParams), root.params);
    return {
        type: 'ExportNamedDeclaration',
        declaration: root,
    };
}
exports.transformFunc = transformFunc;
//# sourceMappingURL=transformFunc.js.map