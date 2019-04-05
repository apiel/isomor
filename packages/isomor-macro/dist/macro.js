"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { createMacro, MacroError } = require('babel-plugin-macros');
exports.default = createMacro(myMacro);
function myMacro({ references, state, babel }) {
    console.log('references', references.default[0]);
    references.default[0].replaceWith(babel.types.stringLiteral('hi there'));
}
//# sourceMappingURL=macro.js.map