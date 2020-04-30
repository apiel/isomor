import { Statement, JsonAst } from './ast';

interface BodyRemote {
    path: string;
    pkgName: string;
    name: string;
    className?: string;
    httpBaseUrl: string;
    wsBaseUrl: string;
    wsReg?: RegExp;
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

export function getCodeFunc({ bodyParams, withTypes }: CodeFunc) {
    return ({
        type: 'ExportDefaultDeclaration',
        declaration: {
            type: 'FunctionDeclaration',
            params: getParams(withTypes),
            body: getBody(bodyParams),
        },
    } as any) as Statement;
}

export function getCodeArrowFunc({ bodyParams, withTypes }: CodeFunc) {
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
                        params: getParams(withTypes),
                        body: getBody(bodyParams),
                    },
                },
            ],
            kind: 'const',
        },
    } as any) as Statement;
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

export function getBody(bodyRemote: BodyRemote) {
    return {
        type: 'BlockStatement',
        body: [getBodyRemote(bodyRemote)],
    };
}

function getVarRemote(params: any) {
    return {
        type: 'VariableDeclaration',
        declarations: [
            {
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'args',
                    // here should deactivate if NoType sets
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
                    // this might be a problem with spread
                    // maybe better try to remove types
                    elements: params.map((param: any) => ({
                        type: 'Identifier',
                        name:
                            param.type === 'AssignmentPattern'
                                ? param.left.name
                                : param.name,
                    })),
                },
            },
        ],
        kind: 'var',
    };
}

function getBodyRemote({
    wsReg,
    path,
    pkgName,
    name,
    className,
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
