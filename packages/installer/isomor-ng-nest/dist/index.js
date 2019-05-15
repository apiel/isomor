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
            logol_1.info('Setup angular and nest with isomor');
            const { _: [projectName] } = minimist(process.argv.slice(2));
            const projectDirectory = path_1.join(process.cwd(), projectName);
            logol_1.info('Install angular in', projectDirectory);
            if (!projectDirectory) {
                logol_1.warn(`Please provide the project name, e.g: npx isomor-ng-nest my-app`);
                return;
            }
            yield shell('npx', ['@angular/cli', 'new', projectName, '--defaults=true']);
            logol_1.info('Copy tsconfig.server.json');
            fs_extra_1.copySync(path_1.join(__dirname, '..', 'tsconfig.server.json'), path_1.join(projectDirectory, 'tsconfig.server.json'));
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
            fs_extra_1.writeFileSync('cmd', `cd ${projectDirectory} && \
            yarn add isomor react-async-cache @nestjs/common @nestjs/core && \
            yarn add run-screen nodemon --dev`);
            yield shell('bash', ['cmd']);
            fs_extra_1.unlinkSync('cmd');
            logol_1.info('Copy example component');
            fs_extra_1.copySync(path_1.join(__dirname, '..', 'example', 'server'), path_1.join(projectDirectory, srcFolder, 'server'));
            fs_extra_1.copySync(path_1.join(__dirname, '..', 'example', 'uptime'), path_1.join(projectDirectory, srcFolder, 'app', 'uptime'));
            let AppModule = fs_extra_1.readFileSync(path_1.join(projectDirectory, srcFolder, 'app', 'app.module.ts')).toString();
            AppModule = `
import { ApiService } from '../server/api.service';
import { UptimeComponent } from './uptime/uptime.component';

        ` + AppModule;
            AppModule = AppModule.replace('declarations: [', 'declarations: [ UptimeComponent,');
            AppModule = AppModule.replace('providers: [', 'providers: [ ApiService,');
            fs_extra_1.writeFileSync(path_1.join(projectDirectory, srcFolder, 'app', 'app.module.ts'), AppModule);
            let AppHtml = fs_extra_1.readFileSync(path_1.join(projectDirectory, srcFolder, 'app', 'app.component.html')).toString();
            AppHtml = `<app-uptime></app-uptime>\n` + AppHtml;
            fs_extra_1.writeFileSync(path_1.join(projectDirectory, srcFolder, 'app', 'app.component.html'), AppHtml);
            logol_1.info('Setup proxy');
            fs_extra_1.copySync(path_1.join(__dirname, '..', 'proxy.conf.json'), path_1.join(projectDirectory, 'proxy.conf.json'));
            const angularJson = fs_extra_1.readJSONSync(path_1.join(projectDirectory, 'angular.json'));
            angularJson.projects[projectName].architect.serve.options.proxyConfig = 'proxy.conf.json';
            fs_extra_1.writeJSONSync(path_1.join(projectDirectory, 'angular.json'), angularJson);
            logol_1.info('Edit .gitignore');
            const gitingore = fs_extra_1.readFileSync(path_1.join(projectDirectory, '.gitignore'))
                + `\n\n/src\n`;
            fs_extra_1.writeFileSync(path_1.join(projectDirectory, '.gitignore'), gitingore);
            logol_1.success(`Ready to code :-)`);
            console.log(chalk_1.default.bold(chalk_1.default.yellow('Important: ')), chalk_1.default.blue(`edit you code in ${chalk_1.default.bold(srcFolder)}`), `instead of ${distAppFolder}`);
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
    serverFolder: process.env.SERVER_FOLDER || '/server',
});
//# sourceMappingURL=index.js.map