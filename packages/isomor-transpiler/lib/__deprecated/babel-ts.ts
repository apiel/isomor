import { declare } from '@babel/helper-plugin-utils';
import syntaxTypeScript from '@babel/plugin-syntax-typescript';
import { types as t } from '@babel/core';

export default declare((api) => {
  api.assertVersion(7);

  return {
    name: 'transform-typescript',
    inherits: syntaxTypeScript,

    visitor: {
      Program(path, state: any) {
        state.programPath = path;

        // remove type imports
        for (const stmt of path.get('body')) {
          if (t.isImportDeclaration(stmt)) {

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

            // // console.log('allElided', allElided, importsToRemove);
            // if (allElided) {
            //   (stmt as any).remove();
            // } else {
            //   for (const importPath of importsToRemove) {
            //     importPath.remove();
            //   }
            // }
          }
        }
      },


    },
  };
});
