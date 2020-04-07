#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const packageJson = require('../package.json');
require('please-upgrade-node')(packageJson, {
    message: (v) => `
    ┌────────────────────────────────────────────────────────┐
    │  isomor-server requires at least version ${v} of Node.   │
    │                     Please upgrade.                    │
    └────────────────────────────────────────────────────────┘
    `,
});
const logol_1 = require("logol");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const child_process_1 = require("child_process");
const chalk = require("chalk");
const minimist = require("minimist");
const isomor_core_1 = require("isomor-core");
const process_1 = require("process");
function start({ srcFolder, distAppFolder, serverFolder }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const npx = process_1.platform === 'win32' ? 'npx.cmd' : 'npx';
            const npm = process_1.platform === 'win32' ? 'npm.cmd' : 'npm';
            logol_1.info('Setup create-react-app with isomor');
            let { _: [projectDirectory] } = minimist(process.argv.slice(2));
            projectDirectory = path_1.join(process.cwd(), projectDirectory);
            logol_1.info('Install create-react-app in', projectDirectory);
            if (!projectDirectory) {
                logol_1.warn(`Please provide the project directory, e.g: npx isomor-react-app my-app`);
                return;
            }
            yield shell(npx, ['create-react-app', projectDirectory, '--typescript']);
            logol_1.info('Copy tsconfig.server.json');
            fs_extra_1.copySync(path_1.join(__dirname, '..', 'tsconfig.server.json'), path_1.join(projectDirectory, 'tsconfig.server.json'));
            logol_1.info(`Copy ${distAppFolder} to ${srcFolder}`);
            fs_extra_1.copySync(path_1.join(projectDirectory, distAppFolder), path_1.join(projectDirectory, srcFolder));
            logol_1.info('Edit package.json');
            const pkg = fs_extra_1.readJSONSync(path_1.join(projectDirectory, 'package.json'));
            pkg.proxy = 'http://127.0.0.1:3005';
            const pkgExample = fs_extra_1.readJSONSync(path_1.join(__dirname, '..', 'package-copy.json'));
            if (pkgExample.scripts['run-in-docker']) {
                delete pkgExample.scripts['run-in-docker'];
            }
            pkg.scripts = Object.assign(Object.assign({}, pkgExample.scripts), pkg.scripts);
            fs_extra_1.writeJSONSync(path_1.join(projectDirectory, 'package.json'), pkg);
            logol_1.info('Install packages...');
            yield shell(npm, [
                'install',
                '--prefix',
                projectDirectory,
                'run-screen',
                'nodemon',
                'isomor-transpiler',
                'isomor-server',
                '--save-dev',
            ]);
            logol_1.info('Create empty server/data.ts');
            fs_extra_1.outputFileSync(path_1.join(projectDirectory, srcFolder, serverFolder, 'data.ts'), ``);
            logol_1.info('Copy example component');
            fs_extra_1.copySync(path_1.join(__dirname, '..', 'example'), path_1.join(projectDirectory, srcFolder, 'uptime'));
            const AppContent = fs_extra_1.readFileSync(path_1.join(projectDirectory, srcFolder, 'App.tsx')).toString();
            const AppWithUptime = AppContent.replace('</p>', `</p>\n<Uptime />\n`);
            const App = `import { Uptime } from './uptime/uptime';\n` + AppWithUptime;
            fs_extra_1.writeFileSync(path_1.join(projectDirectory, srcFolder, 'App.tsx'), App);
            logol_1.info('Edit .gitignore');
            const gitingore = fs_extra_1.readFileSync(path_1.join(projectDirectory, '.gitignore'))
                + `\n\n/src\n`;
            fs_extra_1.writeFileSync(path_1.join(projectDirectory, '.gitignore'), gitingore);
            logol_1.success(`Ready to code :-)`);
            console.log(chalk.bold(chalk.yellow('Important: ')), chalk.blue(`edit you code in ${chalk.bold(srcFolder)}`), `instead of ${distAppFolder}`);
        }
        catch (err) {
            logol_1.error(err);
            process.exit(1);
        }
    });
}
function shell(command, args) {
    return new Promise((resolve) => {
        const cmd = child_process_1.spawn(command, args);
        cmd.stdout.on('data', data => {
            process.stdout.write(chalk.gray(data.toString()));
        });
        cmd.stderr.on('data', data => {
            const dataStr = data.toString();
            if (dataStr.indexOf('warning') === 0) {
                process.stdout.write(chalk.yellow('warming') + dataStr.substring(7));
            }
            else {
                process.stdout.write(chalk.red(data.toString()));
            }
        });
        cmd.on('close', resolve);
    });
}
start(isomor_core_1.getOptions());
//# sourceMappingURL=index.js.map