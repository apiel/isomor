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
function getCodeFunc({ bodyParams }) {
    return {
        type: 'ExportDefaultDeclaration',
        declaration: {
            type: 'FunctionDeclaration',
            params: getParams(),
            body: getBody(bodyParams),
        },
    };
}
exports.getCodeFunc = getCodeFunc;
function getCodeArrowFunc({ bodyParams }) {
    return {
        type: 'ExportNamedDeclaration',
        declaration: {
            type: 'VariableDeclaration',
            declarations: [
                {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: bodyParams.name,
                    },
                    init: {
                        type: 'ArrowFunctionExpression',
                        params: getParams(),
                        body: getBody(bodyParams),
                    },
                },
            ],
            kind: 'const',
        },
    };
}
exports.getCodeArrowFunc = getCodeArrowFunc;
function getParams() {
    return [
        Object.assign({ type: 'RestElement', argument: {
                type: 'Identifier',
                name: 'args',
            } }, getTypeAny()),
    ];
}
function getTypeAny() {
    return {
        typeAnnotation: {
            type: 'TSTypeAnnotation',
            typeAnnotation: {
                type: 'TSAnyKeyword',
            },
        },
    };
}
function getBody(bodyRemote) {
    return {
        type: 'BlockStatement',
        body: [getBodyRemote(bodyRemote)],
    };
}
exports.getBody = getBody;
function getBodyRemote({ wsReg, moduleName, name, httpBaseUrl, wsBaseUrl, }) {
    var _a;
    const protocol = ((_a = wsReg) === null || _a === void 0 ? void 0 : _a.test(name)) ? 'ws' : 'http';
    const baseUrl = protocol === 'ws' ? wsBaseUrl : httpBaseUrl;
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
                    value: protocol,
                },
                {
                    type: 'StringLiteral',
                    value: baseUrl,
                },
                {
                    type: 'StringLiteral',
                    value: moduleName,
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
    };
}
function getBodyEmptyReturn() {
    return {
        type: 'BlockStatement',
        body: [
            {
                type: 'ReturnStatement',
                argument: {
                    type: 'TSAsExpression',
                    expression: {
                        type: 'Identifier',
                        name: 'undefined',
                    },
                    typeAnnotation: {
                        type: 'TSAnyKeyword',
                    },
                },
            },
        ],
    };
}
exports.getBodyEmptyReturn = getBodyEmptyReturn;
//# sourceMappingURL=code.js.map