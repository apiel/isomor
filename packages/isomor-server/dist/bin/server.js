#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pkg = require('../../package.json');
require('please-upgrade-node')(pkg, {
    message: (v) => `
    ┌────────────────────────────────────────────────────────┐
    │  isomor-server requires at least version ${v} of Node.   │
    │                     Please upgrade.                    │
    └────────────────────────────────────────────────────────┘
    `,
});
const lib_1 = require("../lib");
lib_1.server();
//# sourceMappingURL=server.js.map