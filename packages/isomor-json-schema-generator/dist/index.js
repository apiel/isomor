#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isomor_core_1 = require("isomor-core");
const build_1 = require("./build");
const pkg = require('../package.json');
require('please-upgrade-node')(pkg, {
    message: (v) => `
    ┌─────────────────────────────────────────────────────────┐
    │ isomor-transpiler requires at least version ${v} of Node. │
    │                     Please upgrade.                     │
    └─────────────────────────────────────────────────────────┘
    `,
});
const options = isomor_core_1.getOptions();
if (process.argv.includes('--watch')) {
    options.watchMode = true;
}
build_1.build(options);
//# sourceMappingURL=index.js.map