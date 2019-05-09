import { declare } from '@babel/helper-plugin-utils';
import syntaxTypeScript from '@babel/plugin-syntax-typescript';
import { types as t } from '@babel/core';

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

interface State {
  programPath: any;
}

const PARSED_PARAMS = new WeakSet();
const PRAGMA_KEY = '@babel/plugin-transform-typescript/jsxPragma';

export default declare((api, { jsxPragma = 'React' }) => {
  api.assertVersion(7);

  const JSX_ANNOTATION_REGEX = /\*?\s*@jsx\s+([^\s]+)/;

  return {
    name: 'transform-typescript',
    inherits: syntaxTypeScript,

    visitor: {
      //'Pattern' alias doesn't include Identifier or RestElement.
      Pattern: visitPattern,
      Identifier: visitPattern,
      RestElement: visitPattern,

      Program(path, state: any) {
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

        // remove type imports
        for (const stmt of path.get('body')) {
          if (t.isImportDeclaration(stmt)) {
            // Note: this will allow both `import { } from 'm'` and `import 'm';`.
            // In TypeScript, the former would be elided.
            if ((stmt as any).node.specifiers.length === 0) {
              continue;
            }

            let allElided = true;
            const importsToRemove = [];

            for (const specifier of (stmt as any).node.specifiers) {
              const binding = (stmt as any).scope.getBinding(specifier.local.name);

              // The binding may not exist if the import node was explicitly
              // injected by another plugin. Currently core does not do a good job
              // of keeping scope bindings synchronized with the AST. For now we
              // just bail if there is no binding, since chances are good that if
              // the import statement was injected then it wasn't a typescript type
              // import anyway.
              if (
                binding &&
                isImportTypeOnly(file, binding, state.programPath)
              ) {
                importsToRemove.push(binding.path);
              } else {
                allElided = false;
              }
            }

            if (allElided) {
              (stmt as any).remove();
            } else {
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
        if (path.node.declare) path.remove();
      },

      VariableDeclarator({ node }) {
        if (node.definite) node.definite = null;
      },

      ClassMethod(path) {
        const { node } = path;

        if (node.accessibility) node.accessibility = null;
        if (node.abstract) node.abstract = null;
        if (node.optional) node.optional = null;

        // Rest handled by Function visitor
      },

      ClassProperty(path) {
        const { node } = path;

        if (node.accessibility) node.accessibility = null;
        if (node.abstract) node.abstract = null;
        if (node.readonly) node.readonly = null;
        if (node.optional) node.optional = null;
        if (node.definite) node.definite = null;
        if (node.typeAnnotation) node.typeAnnotation = null;
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

        if (node.typeParameters) node.typeParameters = null;
        if (node.superTypeParameters) node.superTypeParameters = null;
        if (node.implements) node.implements = null;
        if (node.abstract) node.abstract = null;

        // Similar to the logic in `transform-flow-strip-types`, we need to
        // handle `TSParameterProperty` and `ClassProperty` here because the
        // class transform would transform the class, causing more specific
        // visitors to not run.
        path.get('body.body').forEach(child => {
          const childNode = child.node;

          if (t.isClassMethod(childNode, { kind: 'constructor' })) {
            // Collects parameter properties so that we can add an assignment
            // for each of them in the constructor body
            //
            // We use a WeakSet to ensure an assignment for a parameter
            // property is only added once. This is necessary for cases like
            // using `transform-classes`, which causes this visitor to run
            // twice.
            const parameterProperties = [];
            for (const param of childNode.params) {
              if (
                param.type === 'TSParameterProperty' &&
                !PARSED_PARAMS.has(param.parameter)
              ) {
                PARSED_PARAMS.add(param.parameter);
                parameterProperties.push(param.parameter);
              }
            }

            if (parameterProperties.length) {
              const assigns = parameterProperties.map(p => {
                let name;
                if (t.isIdentifier(p)) {
                  name = p.name;
                } else if (t.isAssignmentPattern(p) && t.isIdentifier(p.left)) {
                  name = p.left.name;
                } else {
                  throw path.buildCodeFrameError(
                    'Parameter properties can not be destructuring patterns.',
                  );
                }

                const assign = t.assignmentExpression(
                  '=',
                  t.memberExpression(t.thisExpression(), t.identifier(name)),
                  t.identifier(name),
                );
                return t.expressionStatement(assign);
              });

              const statements = childNode.body.body;

              const first = statements[0];

              const startsWithSuperCall =
                first !== undefined &&
                t.isExpressionStatement(first) &&
                t.isCallExpression(first.expression) &&
                t.isSuper(first.expression.callee);

              // Make sure to put parameter properties *after* the `super`
              // call. TypeScript will enforce that a 'super()' call is the
              // first statement when there are parameter properties.
              childNode.body.body = startsWithSuperCall
                ? [first, ...assigns, ...statements.slice(1)]
                : [...assigns, ...statements];
            }
          } else if (child.isClassProperty()) {
            childNode.typeAnnotation = null;

            if (!childNode.value && !childNode.decorators) {
              child.remove();
            }
          }
        });
      },

      Function({ node }) {
        if (node.typeParameters) node.typeParameters = null;
        if (node.returnType) node.returnType = null;

        const p0 = node.params[0];
        if (p0 && t.isIdentifier(p0) && p0.name === 'this') {
          node.params.shift();
        }

        // We replace `TSParameterProperty` here so that transforms that
        // rely on a `Function` visitor to deal with arguments, like
        // `transform-parameters`, work properly.
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

      // TSInterfaceDeclaration(path) {
      //   path.remove();
      // },

      // TSTypeReference(path) {
      //   console.log('path', path);
      //   path.remove();
      // },

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
        } while (t.isTSAsExpression(node));
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
    if (node.typeAnnotation) node.typeAnnotation = null;
    if (t.isIdentifier(node) && node.optional) node.optional = null;
    // 'access' and 'readonly' are only for parameter properties, so constructor visitor will handle them.
  }

  function isImportTypeOnly(file, binding, programPath) {
    // for (const path of binding.referencePaths) {
    //   if (!isInType(path)) {
    //     return false;
    //   }
    // }

    const fileJsxPragma = file.get(PRAGMA_KEY) || jsxPragma;
    if (binding.identifier.name !== fileJsxPragma) {
      return true;
    }

    // 'React' or the JSX pragma is referenced as a value if there are any JSX elements in the code.
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
