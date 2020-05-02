#!/usr/bin/env node

import { getOptions } from 'isomor-core';
import { build } from './build';

const pkg = require('../package.json'); // tslint:disable-line
require('please-upgrade-node')(pkg, {  // tslint:disable-line
    message: (v: string) => `
    ┌─────────────────────────────────────────────────────────┐
    │ isomor-transpiler requires at least version ${v} of Node. │
    │                     Please upgrade.                     │
    └─────────────────────────────────────────────────────────┘
    `,
});

const options = getOptions();
if (process.argv.includes('--watch')) {
    options.watchMode = true;
}
build(options);
