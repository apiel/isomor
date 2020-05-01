import { Statement, JsonAst } from './ast';

interface BodyRemote {
    moduleName: string;
    name: string;
    httpBaseUrl: string;
    wsBaseUrl: string;
    wsReg?: RegExp;
}

export interface CodeFunc {
    bodyParams: BodyRemote;
}

export function getCodeType(name: string) {
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
    } as Statement;
}

function getCodeImportSpecifier(name: string) {
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

export function getCodeImport() {
    return ({
        type: 'ImportDeclaration',
        specifiers: [
            getCodeImportSpecifier('isomorRemote'),
            // getCodeImportSpecifier('isomorValidate'),
        ],
        source: {
            type: 'StringLiteral',
            value: 'isomor',
        },
    } as any) as Statement; // need to try to remove any
}

export function getCodeFunc({ bodyParams }: CodeFunc) {
    return ({
        type: 'ExportDefaultDeclaration',
        declaration: {
            type: 'FunctionDeclaration',
            params: getParams(),
            body: getBody(bodyParams),
        },
    } as any) as Statement;
}

export function getCodeArrowFunc({ bodyParams }: CodeFunc) {
    return ({
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
    } as any) as Statement;
}

// arguments => (...args)
function getParams() {
    return [
        {
            type: 'RestElement',
            argument: {
                type: 'Identifier',
                name: 'args',
            },
            ...getTypeAny(),
        },
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

export function getBody(bodyRemote: BodyRemote) {
    return {
        type: 'BlockStatement',
        body: [getBodyRemote(bodyRemote)],
    };
}

function getBodyRemote({
    wsReg,
    moduleName,
    name,
    httpBaseUrl,
    wsBaseUrl,
}: BodyRemote) {
    const protocol = wsReg?.test(name) ? 'ws' : 'http';
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

export function getBodyEmptyReturn() {
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
