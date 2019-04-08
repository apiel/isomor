#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fancy_log_1 = require("fancy-log");
const child_process_1 = require("child_process");
function start(options) {
    fancy_log_1.info('Setup create-react-app with isomor');
    const output = child_process_1.execSync('npx create-react-app --help');
    console.log('output:', output);
}
start({
    srcFolder: process.env.SRC_FOLDER || './src-isomor',
    distAppFolder: process.env.DIST_APP_FOLDER || './src',
});
//# sourceMappingURL=index.js.map