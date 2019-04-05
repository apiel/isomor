import { DeclareExportDeclaration } from '@babel/types';

export function getCodeFunc(fileName: string, name: string, withTypes: boolean): any {
    return {
        type: 'ExportNamedDeclaration',
        declaration: {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name,
            },
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

export function getCodeArrowFunc(fileName: string, name: string, withTypes: boolean): any {
    return {
        type: 'ExportNamedDeclaration',
        specifiers: [],
        source: null,
        declaration: {
            type: 'VariableDeclaration',
            declarations: [
                {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name,
                    },
                    init: {
                        type: 'ArrowFunctionExpression',
                        id: null,
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
                },
            ],
            kind: 'const',
        },
    };
}
