#!/usr/bin/env node

const pkg = require('../../package.json'); // tslint:disable-line
require('please-upgrade-node')(pkg, {  // tslint:disable-line
    message: (v: string) => `
    ┌────────────────────────────────────────────────────────┐
    │  isomor-server requires at least version ${v} of Node.   │
    │                     Please upgrade.                    │
    └────────────────────────────────────────────────────────┘
    `,
});

import { server } from '../lib';

server();
