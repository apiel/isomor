"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getCodeType(name) {
    return {
        type: 'ExportNamedDeclaration',
        declaration: {
            type: 'TSTypeAliasDeclaration',
            id: {
                type: 'Identifier',
                name,
            },
            typeAnnotation: {
                type: 'TSAnyKeyword',
            },
        },
        specifiers: [],
    };
}
exports.getCodeType = getCodeType;
function getCodeImport() {
    const name = 'remote';
    return {
        type: 'ImportDeclaration',
        specifiers: [
            {
                type: 'ImportSpecifier',
                imported: {
                    type: 'Identifier',
                    name,
                },
                local: {
                    type: 'Identifier',
                    name,
                },
            },
        ],
        source: {
            type: 'StringLiteral',
            value: 'isomor',
        },
    };
}
exports.getCodeImport = getCodeImport;
function getCodeFunc(fileName, name, withTypes) {
    return {
        type: 'ExportNamedDeclaration',
        declaration: {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name,
            },
            params: getParams(withTypes),
            body: getBody(fileName, name),
        },
    };
}
exports.getCodeFunc = getCodeFunc;
function getCodeArrowFunc(fileName, name, withTypes) {
    return {
        type: 'ExportNamedDeclaration',
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
                        params: getParams(withTypes),
                        body: getBody(fileName, name),
                    },
                },
            ],
            kind: 'const',
        },
    };
}
exports.getCodeArrowFunc = getCodeArrowFunc;
function getParams(withTypes) {
    return [
        Object.assign({ type: 'RestElement', argument: {
                type: 'Identifier',
                name: 'args',
            } }, getTypeAny(withTypes)),
    ];
}
function getTypeAny(withTypes) {
    return withTypes ? {
        typeAnnotation: {
            type: 'TSTypeAnnotation',
            typeAnnotation: {
                type: 'TSAnyKeyword',
            },
        },
    } : {};
}
function getBody(fileName, name) {
    return {
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
    };
}
//# sourceMappingURL=code.js.map