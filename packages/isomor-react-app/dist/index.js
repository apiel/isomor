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
const fancy_log_1 = require("fancy-log");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const child_process_1 = require("child_process");
const chalk_1 = require("chalk");
const minimist = require("minimist");
function start(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { srcFolder, distAppFolder } = options;
        fancy_log_1.info('Setup create-react-app with isomor');
        fancy_log_1.info('Install create-react-app');
        let { _: [projectDirectory] } = minimist(process.argv.slice(2));
        projectDirectory = path_1.join(process.cwd(), projectDirectory);
        if (!projectDirectory) {
            fancy_log_1.warn(`${chalk_1.default.yellow('Please provide the project directory')} e.g: npx isomor-react-app my-app`);
            return;
        }
        yield shell('npx', ['create-react-app', projectDirectory, '--typescript']);
        fancy_log_1.info('Copy tsconfig.server.json');
        fs_extra_1.copySync(path_1.join(__dirname, '..', 'tsconfig.server.json'), path_1.join(projectDirectory, 'tsconfig.server.json'));
        fancy_log_1.info(`Copy ${distAppFolder} to ${srcFolder}`);
        fs_extra_1.copySync(path_1.join(projectDirectory, distAppFolder), path_1.join(projectDirectory, srcFolder));
        fancy_log_1.info('Edit package.json');
        const pkg = fs_extra_1.readJSONSync(path_1.join(projectDirectory, 'package.json'));
        pkg.proxy = 'http://127.0.0.1:3005';
        const pkgExample = fs_extra_1.readJSONSync(path_1.join(__dirname, '..', '..', 'example', 'package.json'));
        pkg.scripts = pkgExample.scripts;
        fs_extra_1.writeJSONSync(path_1.join(projectDirectory, 'package.json'), pkg);
        fancy_log_1.info('Install isomor-react');
        fs_extra_1.writeFileSync('cmd', `cd ${projectDirectory} && yarn add isomor isomor-react && yarn add npm-run-all nodemon --dev`);
        yield shell('bash', ['cmd']);
        fs_extra_1.unlinkSync('cmd');
        fancy_log_1.info('Setup isomor-react in <App />');
        const index = `import { IsomorProvider } from 'isomor-react';\n`
            + fs_extra_1.readFileSync(path_1.join(projectDirectory, srcFolder, 'index.tsx')).toString();
        const newIndex = index.replace(/\<App \/\>/g, '(<IsomorProvider><App /></IsomorProvider>)');
        fs_extra_1.writeFileSync(path_1.join(projectDirectory, srcFolder, 'index.tsx'), newIndex);
        fancy_log_1.info(`Ready to code :-) ${chalk_1.default.bold(chalk_1.default.red('Important: ') + chalk_1.default.blue(`edit you code in ${srcFolder}`))} instead of ${distAppFolder}`);
    });
}
function shell(command, args) {
    return new Promise((resolve) => {
        const cmd = child_process_1.spawn(command, args);
        cmd.stdout.on('data', data => {
            process.stdout.write(chalk_1.default.gray(data.toString()));
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
        cmd.on('close', resolve);
    });
}
start({
    srcFolder: process.env.SRC_FOLDER || './src-isomor',
    distAppFolder: process.env.DIST_APP_FOLDER || './src',
});
//# sourceMappingURL=index.js.map