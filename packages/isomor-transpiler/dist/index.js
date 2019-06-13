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
build_1.build(isomor_core_1.getOptions());
//# sourceMappingURL=index.js.map