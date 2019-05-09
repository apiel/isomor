"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_plugin_utils_1 = require("@babel/helper-plugin-utils");
const plugin_syntax_typescript_1 = require("@babel/plugin-syntax-typescript");
const core_1 = require("@babel/core");
function isInType(path) {
    switch (path.parent.type) {
        case 'TSTypeReference':
        case 'TSQualifiedName':
        case 'TSExpressionWithTypeArguments':
        case 'TSTypeQuery':
            return true;
        default:
            return false;
    }
}
const PARSED_PARAMS = new WeakSet();
const PRAGMA_KEY = '@babel/plugin-transform-typescript/jsxPragma';
exports.default = helper_plugin_utils_1.declare((api, { jsxPragma = 'React' }) => {
    api.assertVersion(7);
    const JSX_ANNOTATION_REGEX = /\*?\s*@jsx\s+([^\s]+)/;
    return {
        name: 'transform-typescript',
        inherits: plugin_syntax_typescript_1.default,
        visitor: {
            Pattern: visitPattern,
            Identifier: visitPattern,
            RestElement: visitPattern,
            Program(path, state) {
                state.programPath = path;
                const { file } = state;
                if (file.ast.comments) {
                    for (const comment of (file.ast.comments)) {
                        const jsxMatches = JSX_ANNOTATION_REGEX.exec(comment.value);
                        if (jsxMatches) {
                            file.set(PRAGMA_KEY, jsxMatches[1]);
                        }
                    }
                }
                for (const stmt of path.get('body')) {
                    if (core_1.types.isImportDeclaration(stmt)) {
                        if (stmt.node.specifiers.length === 0) {
                            continue;
                        }
                        let allElided = true;
                        const importsToRemove = [];
                        for (const specifier of stmt.node.specifiers) {
                            const binding = stmt.scope.getBinding(specifier.local.name);
                            if (binding &&
                                isImportTypeOnly(file, binding, state.programPath)) {
                                importsToRemove.push(binding.path);
                            }
                            else {
                                allElided = false;
                            }
                        }
                        if (allElided) {
                            stmt.remove();
                        }
                        else {
                            for (const importPath of importsToRemove) {
                                importPath.remove();
                            }
                        }
                    }
                }
            },
            TSDeclareFunction(path) {
                path.remove();
            },
            TSDeclareMethod(path) {
                path.remove();
            },
            VariableDeclaration(path) {
                if (path.node.declare)
                    path.remove();
            },
            VariableDeclarator({ node }) {
                if (node.definite)
                    node.definite = null;
            },
            ClassMethod(path) {
                const { node } = path;
                if (node.accessibility)
                    node.accessibility = null;
                if (node.abstract)
                    node.abstract = null;
                if (node.optional)
                    node.optional = null;
            },
            ClassProperty(path) {
                const { node } = path;
                if (node.accessibility)
                    node.accessibility = null;
                if (node.abstract)
                    node.abstract = null;
                if (node.readonly)
                    node.readonly = null;
                if (node.optional)
                    node.optional = null;
                if (node.definite)
                    node.definite = null;
                if (node.typeAnnotation)
                    node.typeAnnotation = null;
            },
            TSIndexSignature(path) {
                path.remove();
            },
            ClassDeclaration(path) {
                const { node } = path;
                if (node.declare) {
                    path.remove();
                    return;
                }
            },
            Class(path) {
                const { node } = path;
                if (node.typeParameters)
                    node.typeParameters = null;
                if (node.superTypeParameters)
                    node.superTypeParameters = null;
                if (node.implements)
                    node.implements = null;
                if (node.abstract)
                    node.abstract = null;
                path.get('body.body').forEach(child => {
                    const childNode = child.node;
                    if (core_1.types.isClassMethod(childNode, { kind: 'constructor' })) {
                        const parameterProperties = [];
                        for (const param of childNode.params) {
                            if (param.type === 'TSParameterProperty' &&
                                !PARSED_PARAMS.has(param.parameter)) {
                                PARSED_PARAMS.add(param.parameter);
                                parameterProperties.push(param.parameter);
                            }
                        }
                        if (parameterProperties.length) {
                            const assigns = parameterProperties.map(p => {
                                let name;
                                if (core_1.types.isIdentifier(p)) {
                                    name = p.name;
                                }
                                else if (core_1.types.isAssignmentPattern(p) && core_1.types.isIdentifier(p.left)) {
                                    name = p.left.name;
                                }
                                else {
                                    throw path.buildCodeFrameError('Parameter properties can not be destructuring patterns.');
                                }
                                const assign = core_1.types.assignmentExpression('=', core_1.types.memberExpression(core_1.types.thisExpression(), core_1.types.identifier(name)), core_1.types.identifier(name));
                                return core_1.types.expressionStatement(assign);
                            });
                            const statements = childNode.body.body;
                            const first = statements[0];
                            const startsWithSuperCall = first !== undefined &&
                                core_1.types.isExpressionStatement(first) &&
                                core_1.types.isCallExpression(first.expression) &&
                                core_1.types.isSuper(first.expression.callee);
                            childNode.body.body = startsWithSuperCall
                                ? [first, ...assigns, ...statements.slice(1)]
                                : [...assigns, ...statements];
                        }
                    }
                    else if (child.isClassProperty()) {
                        childNode.typeAnnotation = null;
                        if (!childNode.value && !childNode.decorators) {
                            child.remove();
                        }
                    }
                });
            },
            Function({ node }) {
                if (node.typeParameters)
                    node.typeParameters = null;
                if (node.returnType)
                    node.returnType = null;
                const p0 = node.params[0];
                if (p0 && core_1.types.isIdentifier(p0) && p0.name === 'this') {
                    node.params.shift();
                }
                node.params = node.params.map(p => {
                    return p.type === 'TSParameterProperty' ? p.parameter : p;
                });
            },
            TSModuleDeclaration(path) {
                if (!path.node.declare && path.node.id.type !== 'StringLiteral') {
                    throw path.buildCodeFrameError('Namespaces are not supported.');
                }
                path.remove();
            },
            TSTypeAliasDeclaration(path) {
                path.remove();
            },
            TSEnumDeclaration(path) {
                path.remove();
            },
            TSImportEqualsDeclaration(path) {
                throw path.buildCodeFrameError('stufff');
            },
            TSExportAssignment(path) {
                throw path.buildCodeFrameError('stuffff');
            },
            TSTypeAssertion(path) {
                path.replaceWith(path.node.expression);
            },
            TSAsExpression(path) {
                let { node } = path;
                do {
                    node = node.expression;
                } while (core_1.types.isTSAsExpression(node));
                path.replaceWith(node);
            },
            TSNonNullExpression(path) {
                path.replaceWith(path.node.expression);
            },
            CallExpression(path) {
                path.node.typeParameters = null;
            },
            NewExpression(path) {
                path.node.typeParameters = null;
            },
            JSXOpeningElement(path) {
                path.node.typeParameters = null;
            },
            TaggedTemplateExpression(path) {
                path.node.typeParameters = null;
            },
        },
    };
    function visitPattern({ node }) {
        if (node.typeAnnotation)
            node.typeAnnotation = null;
        if (core_1.types.isIdentifier(node) && node.optional)
            node.optional = null;
    }
    function isImportTypeOnly(file, binding, programPath) {
        const fileJsxPragma = file.get(PRAGMA_KEY) || jsxPragma;
        if (binding.identifier.name !== fileJsxPragma) {
            return true;
        }
        let sourceFileHasJsx = false;
        programPath.traverse({
            JSXElement() {
                sourceFileHasJsx = true;
            },
            JSXFragment() {
                sourceFileHasJsx = true;
            },
        });
        return !sourceFileHasJsx;
    }
});
//# sourceMappingURL=babel-ts.js.map