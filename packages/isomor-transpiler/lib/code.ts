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

export function getCodeFunc(
    wsReg: RegExp | null,
    fileName: string,
    pkgName: string,
    name: string,
    withTypes: boolean,
) {
    return {
        type: 'ExportNamedDeclaration',
        declaration: {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name,
            },
            params: getParams(withTypes),
            body: getBody(wsReg, fileName, pkgName, name),
        },
    } as Statement;
}

export function getCodeArrowFunc(
    wsReg: RegExp | null,
    fileName: string,
    pkgName: string,
    name: string,
    withTypes: boolean,
) {
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
                        body: getBody(wsReg, fileName, pkgName, name),
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

function getBody(
    wsReg: RegExp | null,
    fileName: string,
    pkgName: string,
    name: string,
    className?: string,
) {
    return {
        type: 'BlockStatement',
        body: [
            getBodyRemote(wsReg, fileName, pkgName, name, className),
        ],
    };
}

function getBodyRemote(
    wsReg: RegExp | null,
    fileName: string,
    pkgName: string,
    name: string,
    className?: string,
) {
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
                    value: fileName,
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

export function getCodeMethod(
    wsReg: RegExp | null,
    fileName: string,
    pkgName: string,
    name: string,
    className: string,
    withTypes: boolean,
) {
    return {
        type: 'ClassMethod',
        static: false,
        key: {
            type: 'Identifier',
            name,
        },
        async: true,
        params: getParams(withTypes),
        body: getBody(wsReg, fileName, pkgName, name, className),
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
