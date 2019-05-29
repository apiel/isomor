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
function getCodeImportSpecifier(name) {
    return {
        type: 'ImportSpecifier',
        imported: {
            type: 'Identifier',
            name,
        },
        local: {
            type: 'Identifier',
            name,
        },
    };
}
function getCodeImport() {
    return {
        type: 'ImportDeclaration',
        specifiers: [
            getCodeImportSpecifier('isomorRemote'),
        ],
        source: {
            type: 'StringLiteral',
            value: 'isomor',
        },
    };
}
exports.getCodeImport = getCodeImport;
function getCodeFunc(fileName, name, args, withTypes) {
    return {
        type: 'ExportNamedDeclaration',
        declaration: {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name,
            },
            params: getParams(withTypes),
            body: getBody(fileName, name, args),
        },
    };
}
exports.getCodeFunc = getCodeFunc;
function getCodeArrowFunc(fileName, name, args, withTypes) {
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
                        body: getBody(fileName, name, args),
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
function getBody(fileName, name, args, className) {
    return {
        type: 'BlockStatement',
        body: [
            getBodyArgs(args),
            getBodyArgsObject(args),
            getBodyRemote(fileName, name, className),
        ],
    };
}
function getBodyArgs(args) {
    return {
        type: 'VariableDeclaration',
        declarations: [
            {
                type: 'VariableDeclarator',
                id: {
                    type: 'ArrayPattern',
                    elements: args.map(name => ({
                        type: 'Identifier',
                        name,
                    })),
                },
                init: {
                    type: 'Identifier',
                    name: 'args',
                },
            },
        ],
        kind: 'const',
    };
}
function getBodyArgsObject(args) {
    return {
        type: 'VariableDeclaration',
        declarations: [
            {
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'argsObject',
                },
                init: {
                    type: 'ObjectExpression',
                    properties: args.map(name => ({
                        type: 'ObjectProperty',
                        method: false,
                        key: {
                            type: 'Identifier',
                            name,
                        },
                        computed: false,
                        shorthand: true,
                        value: {
                            type: 'Identifier',
                            name,
                        },
                        extra: {
                            shorthand: true,
                        },
                    })),
                },
            },
        ],
        kind: 'const',
    };
}
function getBodyRemote(fileName, name, className) {
    return {
        type: 'ReturnStatement',
        argument: {
            type: 'CallExpression',
            callee: {
                type: 'Identifier',
                name: 'isomorRemote',
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
                {
                    type: 'Identifier',
                    name: 'argsObject',
                },
                ...(className ? [{
                        type: 'StringLiteral',
                        value: className,
                    }] : []),
            ],
        },
    };
}
function getCodeMethod(fileName, name, className, args, withTypes) {
    return {
        type: 'ClassMethod',
        static: false,
        key: {
            type: 'Identifier',
            name,
        },
        async: true,
        params: getParams(withTypes),
        body: getBody(fileName, name, args, className),
    };
}
exports.getCodeMethod = getCodeMethod;
function getCodeConstructor(withTypes, withSuper = true) {
    return {
        type: 'ClassMethod',
        static: false,
        key: {
            type: 'Identifier',
            name: 'constructor',
        },
        async: false,
        kind: 'constructor',
        params: getParams(withTypes),
        body: {
            type: 'BlockStatement',
            body: !withSuper ? [] : [
                {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Super',
                        },
                        arguments: [],
                    },
                },
            ],
        },
    };
}
exports.getCodeConstructor = getCodeConstructor;
//# sourceMappingURL=code.js.map