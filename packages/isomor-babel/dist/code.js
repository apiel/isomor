"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getCodeFunc(fileName, name, withTypes) {
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
exports.getCodeFunc = getCodeFunc;
function getCodeArrowFunc(fileName, name, withTypes) {
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
exports.getCodeArrowFunc = getCodeArrowFunc;
//# sourceMappingURL=code.js.map