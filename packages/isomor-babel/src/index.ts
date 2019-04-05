
import { Visitor, parseSync } from '@babel/core';
import { isIdentifier, isDeclaration, isFunctionDeclaration } from '@babel/types';
import { parse } from 'path';

export default function() {
    const withTypes = true; // should find out if it is js or ts
    const typing = withTypes ? ': any' : '';

    const visitor: Visitor = {
        Program(path, { filename }: any) {
            const fileName = parse(filename).name;
            // console.log('fileName:', fileName);

            path.node.body.forEach((node, index) => {
                // console.log('node', node);
                // if (isDeclaration(node, { type: 'ExportNamedDeclaration' })) { // doesnt work well with TS
                if (node.type === 'ExportNamedDeclaration') {
                    if (node.declaration.type === 'TSInterfaceDeclaration') {
                        console.log('interface, keep it');
                    } else if (node.declaration.type === 'FunctionDeclaration') {
                        const { name } = node.declaration.id;
                        // const code = `export function ${name}(...args${typing}) {\n  return remote('${fileName}', '${name}', args);\n}\n`;
                        // console.log('function should became:', code);
                        // const newNode = (parseSync(code) as any).program.body[0];
                        // console.log('yoyoyo', JSON.stringify(newNode, null, 4));
                        // // path.node.body[index] = newNode;
                        path.node.body[index] = getFunc(fileName, name, withTypes) as any;
                    } else if (node.declaration.type === 'VariableDeclaration') {
                        const { declarations } = node.declaration;
                        const declaration = declarations[0];
                        if (declaration.type === 'VariableDeclarator'
                            && declaration.init.type === 'ArrowFunctionExpression'
                            && declaration.id.type === 'Identifier') {

                            const { name } = declaration.id;
                            const code = `export const ${name} = (...args${typing}) => {\n  return remote('${fileName}', '${name}', args);\n}\n`;
                            console.log('arrow function should became:', code);
                        } else {
                            console.log('we should remove code', declaration);
                            delete path.node.body[index];
                        }
                    } else {
                        console.log('we should remove code', node.declaration.type);
                        delete path.node.body[index];
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

function getFunc(fileName: string, name: string, withTypes: boolean) {
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
