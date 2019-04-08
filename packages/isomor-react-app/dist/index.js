#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fancy_log_1 = require("fancy-log");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const child_process_1 = require("child_process");
const minimist = require("minimist");
function start(options) {
    const { srcFolder, distAppFolder } = options;
    fancy_log_1.info('Setup create-react-app with isomor');
    const { _: [projectDirectory] } = minimist(process.argv.slice(2));
    const npx = child_process_1.spawn('npx', ['create-react-app', projectDirectory, '--typescript']);
    npx.stdout.on('data', data => {
        process.stdout.write(data.toString());
    });
    npx.stderr.on('data', data => {
        process.stdout.write(data.toString());
    });
    npx.on('close', code => {
        fancy_log_1.info(`child process exited with code ${code}`);
        fs_extra_1.copySync(path_1.join(__dirname, '..', 'tsconfig.server.json'), path_1.join(projectDirectory, 'tsconfig.server.json'));
        fs_extra_1.copySync(path_1.join(projectDirectory, distAppFolder), path_1.join(projectDirectory, srcFolder));
        const pkg = fs_extra_1.readJSONSync(path_1.join(projectDirectory, 'package.json'));
        pkg.proxy = 'http://127.0.0.1:3005';
        const pkgExample = fs_extra_1.readJSONSync(path_1.join(__dirname, '..', '..', 'example', 'package.json'));
        pkg.scripts = pkgExample.scripts;
        fs_extra_1.writeJSONSync(path_1.join(projectDirectory, 'package.json'), pkg);
        const output = child_process_1.execSync(`cd ${projectDirectory} && yarn add isomor isomor-react`);
        fancy_log_1.info(output.toString());
    });
}
start({
    srcFolder: process.env.SRC_FOLDER || './src-isomor',
    distAppFolder: process.env.DIST_APP_FOLDER || './src',
});
//# sourceMappingURL=index.js.map