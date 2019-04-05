"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    const visitor = {
        ExportNamedDeclaration(path, state) {
        },
        Program(path, state) {
            path.node.body.forEach((node, index) => {
                if (node.type === 'ExportNamedDeclaration') {
                    if (node.declaration.type === 'TSInterfaceDeclaration') {
                        console.log('interface, keep it');
                    }
                    else if (node.declaration.type === 'FunctionDeclaration') {
                        const { name } = node.declaration.id;
                        const code = `export function ${name}(...args: typing) {\n  return remote('fileName', '${name}', args);\n}\n`;
                        console.log('function should became:', code);
                    }
                    else if (node.declaration.type === 'VariableDeclaration') {
                        const { declarations } = node.declaration;
                        const declaration = declarations[0];
                        if (declaration.type === 'VariableDeclarator'
                            && declaration.init.type === 'ArrowFunctionExpression'
                            && declaration.id.type === 'Identifier') {
                            const { name } = declaration.id;
                            const code = `export const ${name} = (...args: typing) => {\n  return remote('fileName', '${name}', args);\n}\n`;
                            console.log('arrow function should became:', code);
                        }
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