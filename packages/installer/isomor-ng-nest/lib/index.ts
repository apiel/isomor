#!/usr/bin/env node

const packageJson = require('../package.json'); // tslint:disable-line
require('please-upgrade-node')(packageJson, {  // tslint:disable-line
    message: (v: string) => `
    ┌────────────────────────────────────────────────────────┐
    │  isomor-server requires at least version ${v} of Node.   │
    │                     Please upgrade.                    │
    └────────────────────────────────────────────────────────┘
    `,
});

import { info, warn, error, success } from 'logol';
import {
    copySync,
    readJSONSync,
    writeJSONSync,
    readFileSync,
    writeFileSync,
    unlinkSync,
} from 'fs-extra';
import { join } from 'path';
import { spawn } from 'child_process';
import * as chalk from 'chalk';
import * as minimist from 'minimist';
import { getOptions } from 'isomor-core';
import { platform } from 'process';

interface Options {
    srcFolder: string;
    distAppFolder: string;
    serverFolder: string;
}

async function start({ srcFolder, distAppFolder, serverFolder }: Options) {
    try {
        const npx = platform === 'win32' ? 'npx.cmd' : 'npx';

        info('Setup angular and nest with isomor');
        const { _: [projectName] } = minimist(process.argv.slice(2));
        const projectDirectory = join(process.cwd(), projectName);
        info('Install angular in', projectDirectory);
        if (!projectDirectory) {
            warn(`Please provide the project name, e.g: npx isomor-ng-nest my-app`);
            return;
        }
        await shell(npx, ['@angular/cli', 'new', projectName, '--defaults=true']);

        info('Copy tsconfig.server.json');
        copySync(
            join(__dirname, '..', 'tsconfig.server.json'),
            join(projectDirectory, 'tsconfig.server.json'),
        );

        info(`Copy ${distAppFolder} to ${srcFolder}`);
        copySync(
            join(projectDirectory, distAppFolder),
            join(projectDirectory, srcFolder),
        );

        info('Edit package.json');
        const pkg = readJSONSync(join(projectDirectory, 'package.json'));
        const pkgExample = readJSONSync(join(__dirname, '..', 'package-copy.json'));
        if (pkgExample.scripts['run-in-docker']) { delete pkgExample.scripts['run-in-docker']; }
        pkg.scripts = { ...pkgExample.scripts, ...pkg.scripts };
        writeJSONSync(join(projectDirectory, 'package.json'), pkg);

        info('Install packages...');
        writeFileSync('cmd', `cd ${projectDirectory} && \
            yarn add isomor @nestjs/common @nestjs/core && \
            yarn add run-screen nodemon isomor-transpiler isomor-server --dev`);
        await shell('bash', ['cmd']);
        unlinkSync('cmd');

        info('Copy example component');
        copySync(join(__dirname, '..', 'example', 'server'), join(projectDirectory, srcFolder, 'server'));
        copySync(join(__dirname, '..', 'example', 'uptime'), join(projectDirectory, srcFolder, 'app', 'uptime'));
        let AppModule = readFileSync(join(projectDirectory, srcFolder, 'app', 'app.module.ts')).toString();
        AppModule = `
import { ApiService } from '../server/api.service';
import { UptimeComponent } from './uptime/uptime.component';

        ` + AppModule;
        AppModule = AppModule.replace('declarations: [', 'declarations: [ UptimeComponent,');
        AppModule = AppModule.replace('providers: [', 'providers: [ ApiService,');
        writeFileSync(join(projectDirectory, srcFolder, 'app', 'app.module.ts'), AppModule);
        let AppHtml = readFileSync(join(projectDirectory, srcFolder, 'app', 'app.component.html')).toString();
        AppHtml = `<app-uptime></app-uptime>\n` + AppHtml;
        writeFileSync(join(projectDirectory, srcFolder, 'app', 'app.component.html'), AppHtml);

        info('Setup proxy');
        copySync(join(__dirname, '..', 'proxy.conf.json'), join(projectDirectory, 'proxy.conf.json'));
        const angularJson = readJSONSync(join(projectDirectory, 'angular.json'));
        angularJson.projects[projectName].architect.serve.options.proxyConfig = 'proxy.conf.json';
        writeJSONSync(join(projectDirectory, 'angular.json'), angularJson);

        info('Edit .gitignore');
        const gitingore = readFileSync(join(projectDirectory, '.gitignore'))
            + `\n\n/src\n`;
        writeFileSync(join(projectDirectory, '.gitignore'), gitingore);

        success(`Ready to code :-)`);
        // tslint:disable-next-line
        console.log(
            chalk.bold(chalk.yellow('Important: ')),
            chalk.blue(`edit you code in ${chalk.bold(srcFolder)}`),
            `instead of ${distAppFolder}`,
        );
    } catch (err) {
        error(err);
        process.exit(1);
    }
}

function shell(command: string, args?: ReadonlyArray<string>) {
    return new Promise((resolve) => {
        const cmd = spawn(command, args);
        cmd.stdout.on('data', data => {
            process.stdout.write(chalk.gray(data.toString()));
        });
        cmd.stderr.on('data', data => {
            const dataStr = data.toString();
            if (dataStr.indexOf('warning') === 0) {
                process.stdout.write(chalk.yellow('warming') + dataStr.substring(7));
            } else {
                process.stdout.write(chalk.red(data.toString()));
            }
        });
        cmd.on('close', resolve);
    });
}

start(getOptions());
