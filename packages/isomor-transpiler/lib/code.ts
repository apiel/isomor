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

export function getCodeFunc(fileName: string, name: string, args: string[], withTypes: boolean) {
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
    } as Statement;
}

export function getCodeArrowFunc(fileName: string, name: string, args: string[], withTypes: boolean) {
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
function getBody(fileName: string, name: string, args: string[], className?: string) {
    return {
        type: 'BlockStatement',
        body: [
            getBodyArgs(args),
            getBodyArgsObject(args),
            getBodyRemote(fileName, name, className),
        ],
    };
}

function getBodyArgs(args: string[]) {
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

function getBodyArgsObject(args: string[]) {
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

function getBodyRemote(fileName: string, name: string, className?: string) {
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

export function getCodeMethod(fileName: string, name: string, className: string, args: string[], withTypes: boolean) {
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
