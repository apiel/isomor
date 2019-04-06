"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const code_1 = require("./code");
const debug = debug_1.default('isomor-transpiler:transform');
function transform(body, fileName, withTypes = true) {
    body.forEach((node, index) => {
        if (node.type === 'ExportNamedDeclaration') {
            if (node.declaration.type === 'TSInterfaceDeclaration') {
            }
            else if (node.declaration.type === 'FunctionDeclaration') {
                const { name } = node.declaration.id;
                body[index] = code_1.getCodeFunc(fileName, name, withTypes);
            }
            else if (node.declaration.type === 'VariableDeclaration') {
                const { declarations } = node.declaration;
                const declaration = declarations[0];
                if (declaration.type === 'VariableDeclarator'
                    && declaration.init.type === 'ArrowFunctionExpression'
                    && declaration.id.type === 'Identifier') {
                    const { name } = declaration.id;
                    body[index] = code_1.getCodeArrowFunc(fileName, name, withTypes);
                }
                else {
                    debug('remove code', declaration);
                    delete body[index];
                }
            }
            else {
                debug('remove code', node.declaration.type);
                delete body[index];
            }
        }
        else {
            debug('remove code', node.type);
            delete body[index];
        }
    });
    body.unshift(code_1.getCodeImport());
    return body.filter(statement => statement);
}
exports.default = transform;
//# sourceMappingURL=transform.js.map