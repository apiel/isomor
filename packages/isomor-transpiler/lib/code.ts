import { Statement } from './ast';

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

export function getCodeImport() {
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
    } as any as Statement; // need to try to remove any
}

export function getCodeFunc(fileName: string, name: string, withTypes: boolean) {
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
    } as Statement;
}

export function getCodeArrowFunc(fileName: string, name: string, withTypes: boolean) {
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
    } as Statement;
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

// {
//     return remote("example", "getList2", args);
// }
function getBody(fileName: string, name: string, className?: string) {
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
                        ...(className ? [{
                            type: 'StringLiteral',
                            value: className,
                        }] : []),
                    ],
                },
            },
        ],
    };
}

export function getCodeMethod(fileName: string, name: string, className: string, withTypes: boolean) {
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
                        arguments: [
                            {
                                type: 'SpreadElement',
                                argument: {
                                    type: 'Identifier',
                                    name: 'args',
                                },
                            },
                        ],
                    },
                },
            ],
        },
    } as any as Statement;
}
