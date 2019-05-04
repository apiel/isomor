#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logol_1 = require("logol");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const child_process_1 = require("child_process");
const chalk_1 = require("chalk");
const minimist = require("minimist");
function start({ srcFolder, distAppFolder, serverFolder }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logol_1.info('Setup create-vue-app with isomor');
            const { _: [projectName] } = minimist(process.argv.slice(2));
            const projectDirectory = path_1.join(process.cwd(), projectName);
            logol_1.info('Install VueJs in', projectDirectory);
            logol_1.info('Wait a little bit... we are loading Vue cli');
            if (!projectDirectory) {
                logol_1.warn(`Please provide the project directory, e.g: npx isomor-vue-app my-app`);
                return;
            }
            if (process.env.MANUAL === 'true') {
                logol_1.info('For the moment the installer work only for TypeScript. Please select TypeScript :-)');
                yield shell('npx', ['@vue/cli', 'create', projectName]);
            }
            else {
                const vuePreset = fs_extra_1.readJSONSync(path_1.join(__dirname, '..', 'vue-preset.json'));
                yield shell('npx', ['@vue/cli', 'create', projectName, '-i', JSON.stringify(vuePreset)]);
            }
            logol_1.info('Copy tsconfig.server.json');
            fs_extra_1.copySync(path_1.join(__dirname, '..', 'tsconfig.server.json'), path_1.join(projectDirectory, 'tsconfig.server.json'));
            logol_1.info('Copy vue.config.js');
            fs_extra_1.copySync(path_1.join(__dirname, '..', 'vue.config.js'), path_1.join(projectDirectory, 'vue.config.js'));
            logol_1.info(`Copy ${distAppFolder} to ${srcFolder}`);
            fs_extra_1.copySync(path_1.join(projectDirectory, distAppFolder), path_1.join(projectDirectory, srcFolder));
            logol_1.info('Edit package.json');
            const pkg = fs_extra_1.readJSONSync(path_1.join(projectDirectory, 'package.json'));
            const pkgExample = fs_extra_1.readJSONSync(path_1.join(__dirname, '..', 'package-copy.json'));
            if (pkgExample.scripts['run-in-docker']) {
                delete pkgExample.scripts['run-in-docker'];
            }
            pkg.scripts = Object.assign({}, pkgExample.scripts, pkg.scripts);
            fs_extra_1.writeJSONSync(path_1.join(projectDirectory, 'package.json'), pkg);
            logol_1.info('Install packages...');
            fs_extra_1.writeFileSync('cmd', `cd ${projectDirectory} && yarn add isomor vue-async-cache && yarn add run-screen nodemon --dev`);
            yield shell('bash', ['cmd']);
            fs_extra_1.unlinkSync('cmd');
            logol_1.info('Create empty server/data.ts');
            fs_extra_1.outputFileSync(path_1.join(projectDirectory, srcFolder, serverFolder, 'data.ts'), ``);
            logol_1.info('Copy example component');
            fs_extra_1.copySync(path_1.join(__dirname, '..', 'example'), path_1.join(projectDirectory, srcFolder, 'components'));
            logol_1.success(`Ready to code :-)`);
            console.log(chalk_1.default.bold(chalk_1.default.yellow('Important: ')), chalk_1.default.blue(`edit you code in ${chalk_1.default.bold(srcFolder)}`), `instead of ${distAppFolder}`);
            process.exit();
        }
        catch (err) {
            logol_1.error(err);
            process.exit(1);
        }
    });
}
function shell(command, args) {
    return new Promise((resolve) => {
        let cmd = child_process_1.spawn(command, args, {
            env: Object.assign({ FORCE_COLOR: 'true', COLUMNS: process.stdout.columns.toString(), LINES: process.stdout.rows.toString() }, process.env),
        });
        cmd.stdout.on('data', data => {
            process.stdout.write(data);
        });
        cmd.stderr.on('data', data => {
            const dataStr = data.toString();
            if (dataStr.indexOf('warning') === 0) {
                process.stdout.write(chalk_1.default.yellow('warming') + dataStr.substring(7));
            }
            else {
                process.stdout.write(chalk_1.default.red(data.toString()));
            }
        });
        process.stdin.setEncoding('ascii');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', (key) => {
            if (key === '\u0003') {
                process.exit();
            }
            if (cmd) {
                cmd.stdin.write(key);
            }
        });
        cmd.on('close', () => { cmd = null; resolve(); });
    });
}
start({
    srcFolder: process.env.SRC_FOLDER || './src-isomor',
    distAppFolder: process.env.DIST_APP_FOLDER || './src',
    serverFolder: process.env.SERVER_FOLDER || '/server',
});
//# sourceMappingURL=index.js.map