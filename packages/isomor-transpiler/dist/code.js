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
function getBody(fileName, name, className) {
    return {
        type: 'BlockStatement',
        body: [
            getBodyRemote(fileName, name, className),
        ],
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
                ...(className ? [{
                        type: 'StringLiteral',
                        value: className,
                    }] : []),
            ],
        },
    };
}
function getCodeMethod(fileName, name, className, withTypes) {
    return {
        type: 'ClassMethod',
        static: false,
        key: {
            type: 'Identifier',
            name,
        },
        async: true,
        params: getParams(withTypes),
        body: getBody(fileName, name, className),
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