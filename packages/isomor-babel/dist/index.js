"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const code_1 = require("./code");
function default_1() {
    const withTypes = true;
    const visitor = {
        Program(path, { filename }) {
            const fileName = path_1.parse(filename).name;
            path.node.body.forEach((node, index) => {
                if (node.type === 'ExportNamedDeclaration') {
                    if (node.declaration.type === 'TSInterfaceDeclaration') {
                    }
                    else if (node.declaration.type === 'FunctionDeclaration') {
                        const { name } = node.declaration.id;
                        path.node.body[index] = code_1.getCodeFunc(fileName, name, withTypes);
                    }
                    else if (node.declaration.type === 'VariableDeclaration') {
                        const { declarations } = node.declaration;
                        const declaration = declarations[0];
                        if (declaration.type === 'VariableDeclarator'
                            && declaration.init.type === 'ArrowFunctionExpression'
                            && declaration.id.type === 'Identifier') {
                            const { name } = declaration.id;
                            path.node.body[index] = code_1.getCodeArrowFunc(fileName, name, withTypes);
                        }
                        else {
                            console.log('we should remove code', declaration);
                            delete path.node.body[index];
                        }
                    }
                    else {
                        console.log('we should remove code', node.declaration.type);
                        delete path.node.body[index];
                    }
                }
                else {
                    console.log('we should remove code', node.type);
                    delete path.node.body[index];
                }
                console.log('----');
            });
        },
    };
    return {
        visitor,
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map