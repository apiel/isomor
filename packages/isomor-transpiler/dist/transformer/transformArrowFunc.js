"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("../code");
const validation_1 = require("../validation");
function transformArrowFunc(root, srcFilePath, wsReg, path, pkgName, withTypes) {
    const { declarations } = root;
    const declaration = declarations[0];
    if (declaration.type === 'VariableDeclarator'
        && declaration.init.type === 'ArrowFunctionExpression'
        && declaration.id.type === 'Identifier') {
        const { name } = declaration.id;
        validation_1.setValidator(declaration.init, srcFilePath, path, name);
        return code_1.getCodeArrowFunc(wsReg, path, pkgName, name, withTypes);
    }
}
exports.transformArrowFunc = transformArrowFunc;
//# sourceMappingURL=transformArrowFunc.js.map