
import { Visitor } from '@babel/core';
import { isIdentifier, isDeclaration, isFunctionDeclaration } from '@babel/types';

export default function () {
    const visitor: Visitor = {
        ExportNamedDeclaration(path, state) {
            // console.log('isDeclaration function', isDeclaration(path.node.declaration, { type: 'FunctionDeclaration' }));
            // console.log('isDeclaration var', isDeclaration(path.node.declaration, { type: 'VariableDeclaration' }));
            // console.log('isDeclaration interface', isDeclaration(path.node.declaration, { type: 'TSInterfaceDeclaration' }));

            // console.log('----');
        },
        Program(path, state) {
            // console.log('parent path:', );
            path.node.body.forEach((node, index) => {
                // console.log('node', node);
                // if (isDeclaration(node, { type: 'ExportNamedDeclaration' })) { // doesnt work well with TS
                if (node.type === 'ExportNamedDeclaration') {
                    // console.log('isDeclaration function', isDeclaration(node.declaration, { type: 'FunctionDeclaration' }));
                    // console.log('isDeclaration var', isDeclaration(node.declaration, { type: 'VariableDeclaration' }));
                    // console.log('isDeclaration interface', isDeclaration(node.declaration, { type: 'TSInterfaceDeclaration' })); 

                    if (node.declaration.type === 'TSInterfaceDeclaration') {
                        console.log('interface, keep it');
                    } else if (node.declaration.type === 'FunctionDeclaration') {
                        const { name } = node.declaration.id;
                        const code = `export function ${name}(...args: typing) {\n  return remote('fileName', '${name}', args);\n}\n`;
                        console.log('function should became:', code);
                    } else if (node.declaration.type === 'VariableDeclaration') {
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
                } else {
                    console.log('we should remove code', node.type);
                    // node;
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
