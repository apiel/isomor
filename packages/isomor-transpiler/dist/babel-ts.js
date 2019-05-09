"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_plugin_utils_1 = require("@babel/helper-plugin-utils");
const plugin_syntax_typescript_1 = require("@babel/plugin-syntax-typescript");
const core_1 = require("@babel/core");
const PARSED_PARAMS = new WeakSet();
const PRAGMA_KEY = '@babel/plugin-transform-typescript/jsxPragma';
exports.default = helper_plugin_utils_1.declare((api, { jsxPragma = 'React' }) => {
    api.assertVersion(7);
    const JSX_ANNOTATION_REGEX = /\*?\s*@jsx\s+([^\s]+)/;
    return {
        name: 'transform-typescript',
        inherits: plugin_syntax_typescript_1.default,
        visitor: {
            Program(path, state) {
                state.programPath = path;
                const { file } = state;
                for (const stmt of path.get('body')) {
                    if (core_1.types.isImportDeclaration(stmt)) {
                        let allElided = true;
                        const importsToRemove = [];
                        for (const specifier of stmt.node.specifiers) {
                            const binding = stmt.scope.getBinding(specifier.local.name);
                            if (binding) {
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
        },
    };
});
//# sourceMappingURL=babel-ts.js.map