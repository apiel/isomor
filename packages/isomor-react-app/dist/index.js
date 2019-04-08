#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fancy_log_1 = require("fancy-log");
const child_process_1 = require("child_process");
function start(options) {
    fancy_log_1.info('Setup create-react-app with isomor', process.cwd());
    const npx = child_process_1.spawn('npx', ['create-react-app', '--help']);
    npx.stdout.on('data', data => {
        fancy_log_1.info(data.toString());
    });
    npx.stderr.on('data', data => {
        fancy_log_1.error(data.toString());
    });
    npx.on('close', code => {
        fancy_log_1.info(`child process exited with code ${code}`);
    });
}
start({
    srcFolder: process.env.SRC_FOLDER || './src-isomor',
    distAppFolder: process.env.DIST_APP_FOLDER || './src',
});
//# sourceMappingURL=index.js.map