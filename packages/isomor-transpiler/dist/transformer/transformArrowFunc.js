"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("../code");
const getArgs_1 = require("./utils/getArgs");
function transformArrowFunc(root, path, withTypes) {
    const { declarations } = root;
    const declaration = declarations[0];
    if (declaration.type === 'VariableDeclarator'
        && declaration.init.type === 'ArrowFunctionExpression'
        && declaration.id.type === 'Identifier') {
        const { name } = declaration.id;
        const args = getArgs_1.getArgs(declaration.init, path, name);
        return code_1.getCodeArrowFunc(path, name, args, withTypes);
    }
}
exports.transformArrowFunc = transformArrowFunc;
//# sourceMappingURL=transformArrowFunc.js.map