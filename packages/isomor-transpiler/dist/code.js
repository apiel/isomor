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
function getCodeFunc({ bodyParams, withTypes }) {
    return {
        type: 'ExportNamedDeclaration',
        declaration: {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name: bodyParams.name,
            },
            params: getParams(withTypes),
            body: getBody(bodyParams),
        },
    };
}
exports.getCodeFunc = getCodeFunc;
function getCodeArrowFunc({ bodyParams, withTypes }) {
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
                        params: getParams(withTypes),
                        body: getBody(bodyParams),
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
    return withTypes
        ? {
            typeAnnotation: {
                type: 'TSTypeAnnotation',
                typeAnnotation: {
                    type: 'TSAnyKeyword',
                },
            },
        }
        : {};
}
function getBody(bodyRemote, params) {
    const yo = params ? [getVarRemote(params)] : [];
    return {
        type: 'BlockStatement',
        body: [...yo, getBodyRemote(bodyRemote)],
    };
}
exports.getBody = getBody;
function getVarRemote(params) {
    return {
        type: 'VariableDeclaration',
        declarations: [
            {
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'args',
                    typeAnnotation: {
                        type: 'TSTypeAnnotation',
                        typeAnnotation: {
                            type: 'TSArrayType',
                            elementType: {
                                type: 'TSAnyKeyword',
                            },
                        },
                    },
                },
                init: {
                    type: 'ArrayExpression',
                    elements: params.map((param) => ({
                        type: 'Identifier',
                        name: param.type === 'AssignmentPattern'
                            ? param.left.name
                            : param.name,
                    })),
                },
            },
        ],
        kind: 'var',
    };
}
function getBodyRemote({ wsReg, path, pkgName, name, className, httpBaseUrl, wsBaseUrl, }) {
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
                    value: path,
                },
                {
                    type: 'StringLiteral',
                    value: pkgName,
                },
                {
                    type: 'StringLiteral',
                    value: name,
                },
                {
                    type: 'Identifier',
                    name: 'args',
                },
                ...(className
                    ? [
                        {
                            type: 'StringLiteral',
                            value: className,
                        },
                    ]
                    : []),
            ],
        },
    };
}
//# sourceMappingURL=code.js.map