const { createMacro, MacroError } = require('babel-plugin-macros'); // tslint:disable-line

export default createMacro(myMacro);

function myMacro({references, state, babel}) {
    // state is the second argument you're passed to a visitor in a
    // normal babel plugin. `babel` is the `babel-plugin-macros` module.
    // do whatever you like to the AST paths you find in `references`
    // read more below...

    // console.log('references', references.default[0]);
    // console.log('state', state);
    // console.log('babel', babel);
    references.default[0].replaceWith(babel.types.stringLiteral('hi there'));
}
