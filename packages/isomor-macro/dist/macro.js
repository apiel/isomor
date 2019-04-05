"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { createMacro, MacroError } = require('babel-plugin-macros');
exports.default = createMacro(myMacro);
function myMacro({ references, state, babel }) {
    console.log('references', references);
    console.log('state', state);
}
//# sourceMappingURL=macro.js.map