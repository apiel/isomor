"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function default_1() {
    const withTypes = true;
    const typing = withTypes ? ': any' : '';
    const visitor = {
        Program(path, { filename }) {
            const fileName = path_1.parse(filename).name;
            path.node.body.forEach((node, index) => {
                if (node.type === 'ExportNamedDeclaration') {
                    if (node.declaration.type === 'TSInterfaceDeclaration') {
                        console.log('interface, keep it');
                    }
                    else if (node.declaration.type === 'FunctionDeclaration') {
                        const { name } = node.declaration.id;
                        path.node.body[index] = getFunc(fileName, name, withTypes);
                    }
                    else if (node.declaration.type === 'VariableDeclaration') {
                        const { declarations } = node.declaration;
                        const declaration = declarations[0];
                        if (declaration.type === 'VariableDeclarator'
                            && declaration.init.type === 'ArrowFunctionExpression'
                            && declaration.id.type === 'Identifier') {
                            const { name } = declaration.id;
                            const code = `export const ${name} = (...args${typing}) => {\n  return remote('${fileName}', '${name}', args);\n}\n`;
                            console.log('arrow function should became:', code);
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
function getFunc(fileName, name, withTypes) {
    return {
        type: 'ExportNamedDeclaration',
        declaration: {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name,
            },
            generator: false,
            async: false,
            params: [
                {
                    type: 'RestElement',
                    argument: {
                        type: 'Identifier',
                        name: 'args',
                    },
                },
            ],
            body: {
                type: 'BlockStatement',
                body: [
                    {
                        type: 'ReturnStatement',
                        argument: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'remote',
                            },
                            arguments: [
                                {
                                    type: 'StringLiteral',
                                    value: fileName,
                                },
                                {
                                    type: 'StringLiteral',
                                    value: name,
                                },
                                {
                                    type: 'Identifier',
                                    name: 'args',
                                },
                            ],
                        },
                    },
                ],
                directives: [],
            },
        },
    };
}
//# sourceMappingURL=index.js.map