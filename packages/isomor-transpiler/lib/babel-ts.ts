import { declare } from '@babel/helper-plugin-utils';
import syntaxTypeScript from '@babel/plugin-syntax-typescript';
import { types as t } from '@babel/core';

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
      Program(path, state: any) {
        state.programPath = path;

        const { file } = state;

        // if (file.ast.comments) {
        //   for (const comment of (file.ast.comments)) {
        //     const jsxMatches = JSX_ANNOTATION_REGEX.exec(comment.value);
        //     if (jsxMatches) {
        //       file.set(PRAGMA_KEY, jsxMatches[1]);
        //     }
        //   }
        // }

        // remove type imports
        for (const stmt of path.get('body')) {
          if (t.isImportDeclaration(stmt)) {
            // // Note: this will allow both `import { } from 'm'` and `import 'm';`.
            // // In TypeScript, the former would be elided.
            // if ((stmt as any).node.specifiers.length === 0) {
            //   continue;
            // }

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
              if (binding) {
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


    },
  };
});
