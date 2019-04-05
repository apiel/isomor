
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
        start: 0,
        end: 87,
        loc: {
            start: {
                line: 1,
                column: 0,
            },
            end: {
                line: 3,
                column: 1,
            },
        },
        specifiers: [],
        source: null,
        declaration: {
            type: 'FunctionDeclaration',
            start: 7,
            end: 87,
            loc: {
                start: {
                    line: 1,
                    column: 7,
                },
                end: {
                    line: 3,
                    column: 1,
                },
            },
            id: {
                type: 'Identifier',
                start: 16,
                end: 26,
                loc: {
                    start: {
                        line: 1,
                        column: 16,
                    },
                    end: {
                        line: 1,
                        column: 26,
                    },
                    identifierName: 'getListFoo',
                },
                name: 'getListFoo',
            },
            generator: false,
            async: false,
            params: [
                {
                    type: 'RestElement',
                    start: 27,
                    end: 34,
                    loc: {
                        start: {
                            line: 1,
                            column: 27,
                        },
                        end: {
                            line: 1,
                            column: 34,
                        },
                    },
                    argument: {
                        type: 'Identifier',
                        start: 30,
                        end: 34,
                        loc: {
                            start: {
                                line: 1,
                                column: 30,
                            },
                            end: {
                                line: 1,
                                column: 34,
                            },
                            identifierName: 'args',
                        },
                        name: 'args',
                    },
                },
            ],
            body: {
                type: 'BlockStatement',
                start: 36,
                end: 87,
                loc: {
                    start: {
                        line: 1,
                        column: 36,
                    },
                    end: {
                        line: 3,
                        column: 1,
                    },
                },
                body: [
                    {
                        type: 'ReturnStatement',
                        start: 40,
                        end: 85,
                        loc: {
                            start: {
                                line: 2,
                                column: 2,
                            },
                            end: {
                                line: 2,
                                column: 47,
                            },
                        },
                        argument: {
                            type: 'CallExpression',
                            start: 47,
                            end: 84,
                            loc: {
                                start: {
                                    line: 2,
                                    column: 9,
                                },
                                end: {
                                    line: 2,
                                    column: 46,
                                },
                            },
                            callee: {
                                type: 'Identifier',
                                start: 47,
                                end: 53,
                                loc: {
                                    start: {
                                        line: 2,
                                        column: 9,
                                    },
                                    end: {
                                        line: 2,
                                        column: 15,
                                    },
                                    identifierName: 'remote',
                                },
                                name: 'remote',
                            },
                            arguments: [
                                {
                                    type: 'StringLiteral',
                                    start: 54,
                                    end: 63,
                                    loc: {
                                        start: {
                                            line: 2,
                                            column: 16,
                                        },
                                        end: {
                                            line: 2,
                                            column: 25,
                                        },
                                    },
                                    extra: {
                                        rawValue: 'example',
                                        raw: '\'example\'',
                                    },
                                    value: 'example',
                                },
                                {
                                    type: 'StringLiteral',
                                    start: 65,
                                    end: 77,
                                    loc: {
                                        start: {
                                            line: 2,
                                            column: 27,
                                        },
                                        end: {
                                            line: 2,
                                            column: 39,
                                        },
                                    },
                                    extra: {
                                        rawValue: 'getListFoo',
                                        raw: '\'getListFoo\'',
                                    },
                                    value: 'getListFoo',
                                },
                                {
                                    type: 'Identifier',
                                    start: 79,
                                    end: 83,
                                    loc: {
                                        start: {
                                            line: 2,
                                            column: 41,
                                        },
                                        end: {
                                            line: 2,
                                            column: 45,
                                        },
                                        identifierName: 'args',
                                    },
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
