export function getCodeImport(): any {
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

export function getCodeFunc(fileName: string, name: string, withTypes: boolean): any {
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

export function getCodeArrowFunc(fileName: string, name: string, withTypes: boolean): any {
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
function getBody(fileName: string, name: string) {
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
