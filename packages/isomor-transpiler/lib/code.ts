import { Statement } from './ast';

interface BodyRemote {
    wsReg: RegExp | null;
    path: string;
    pkgName: string;
    name: string;
    className?: string;
}

export interface CodeFunc {
    withTypes: boolean;
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
    return {
        type: 'ImportDeclaration',
        specifiers: [
            getCodeImportSpecifier('isomorRemote'),
            // getCodeImportSpecifier('isomorValidate'),
        ],
        source: {
            type: 'StringLiteral',
            value: 'isomor',
        },
    } as any as Statement; // need to try to remove any
}

export function getCodeFunc({
    bodyParams,
    withTypes,
}: CodeFunc) {
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
    } as any as Statement;
}

export function getCodeArrowFunc({
    bodyParams,
    withTypes,
}: CodeFunc) {
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
    } as any as Statement;
}

// arguments => (...args)
function getParams(withTypes: boolean) {
    return [
        {
            type: 'RestElement',
            argument: {
                type: 'Identifier',
                name: 'args',
            },
            ...getTypeAny(withTypes),
        },
    ];
}

// type => ': any'
function getTypeAny(withTypes: boolean) {
    return withTypes ? {
        typeAnnotation: {
            type: 'TSTypeAnnotation',
            typeAnnotation: {
                type: 'TSAnyKeyword',
            },
        },
    } : {};
}

function getBody(bodyRemote: BodyRemote) {
    return {
        type: 'BlockStatement',
        body: [
            getBodyRemote(bodyRemote),
        ],
    };
}

function getBodyRemote({
    wsReg,
    path,
    pkgName,
    name,
    className,
}: BodyRemote) {
    const protocol = wsReg?.test(name) ? 'ws' : 'http';
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
                ...(className ? [{
                    type: 'StringLiteral',
                    value: className,
                }] : []),
            ],
        },
    };
}

export function getCodeMethod({
    bodyParams,
    withTypes,
}: CodeFunc) {
    return {
        type: 'ClassMethod',
        static: false,
        key: {
            type: 'Identifier',
            name: bodyParams.name,
        },
        async: true,
        params: getParams(withTypes),
        body: getBody(bodyParams),
    } as any as Statement;
}

export function getCodeConstructor(withTypes: boolean, withSuper = true) {
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
    } as any as Statement;
}
