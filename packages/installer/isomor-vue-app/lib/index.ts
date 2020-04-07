#!/usr/bin/env node

const packageJson = require('../package.json'); // tslint:disable-line
require('please-upgrade-node')(packageJson, {
    // tslint:disable-line
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
    outputFileSync,
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
        const npm = platform === 'win32' ? 'npm.cmd' : 'npm';

        info('Setup create-vue-app with isomor');
        const {
            _: [projectName],
        } = minimist(process.argv.slice(2));
        const projectDirectory = join(process.cwd(), projectName);
        info('Install VueJs in', projectDirectory);
        info('Wait a little bit... we are loading Vue');
        if (!projectDirectory) {
            warn(
                `Please provide the project name, e.g: npx isomor-vue-app my-app`,
            );
            return;
        }

        await shell(npx, [
            '@vue/cli',
            'create',
            projectName,
            '--packageManager',
            'npm',
            '-i',
            `{"useConfigFiles":true,"plugins":{"@vue/cli-plugin-babel":{},"@vue/cli-plugin-typescript":{"classComponent":true,"useTsWithBabel":true}}}`,
        ]); // tslint:disable-line

        info('Copy tsconfig.server.json');
        copySync(
            join(__dirname, '..', 'tsconfig.server.json'),
            join(projectDirectory, 'tsconfig.server.json'),
        );

        info('Copy vue.config.js');
        copySync(
            join(__dirname, '..', 'vue.config.js'),
            join(projectDirectory, 'vue.config.js'),
        );

        info(`Copy ${distAppFolder} to ${srcFolder}`);
        copySync(
            join(projectDirectory, distAppFolder),
            join(projectDirectory, srcFolder),
        );

        info('Edit package.json');
        const pkg = readJSONSync(join(projectDirectory, 'package.json'));
        const pkgExample = readJSONSync(
            join(__dirname, '..', 'package-copy.json'),
        );
        if (pkgExample.scripts['run-in-docker']) {
            delete pkgExample.scripts['run-in-docker'];
        }
        pkg.scripts = { ...pkgExample.scripts, ...pkg.scripts };
        writeJSONSync(join(projectDirectory, 'package.json'), pkg);

        info('Install packages...');
        await shell(npm, [
            'install',
            '--prefix',
            projectDirectory,
            'run-screen',
            'nodemon',
            'isomor-transpiler',
            'isomor-server',
            '--save-dev',
        ]);

        info('Create empty server/data.ts');
        outputFileSync(
            join(projectDirectory, srcFolder, serverFolder, 'data.ts'),
            ``,
        );

        info('Copy example component');
        copySync(
            join(__dirname, '..', 'example'),
            join(projectDirectory, srcFolder, 'components'),
        );

        info('Edit .gitignore');
        const gitingore =
            readFileSync(join(projectDirectory, '.gitignore')) + `\n\n/src\n`;
        writeFileSync(join(projectDirectory, '.gitignore'), gitingore);

        success(`Ready to code :-)`);
        // tslint:disable-next-line
        console.log(
            chalk.bold(chalk.yellow('Important: ')),
            chalk.blue(`edit you code in ${chalk.bold(srcFolder)}`),
            `instead of ${distAppFolder}`,
        );
        process.exit();
    } catch (err) {
        error(err);
        process.exit(1);
    }
}

function shell(command: string, args?: ReadonlyArray<string>) {
    return new Promise((resolve) => {
        const cmd = spawn(command, args);
        cmd.stdout.on('data', (data) => {
            process.stdout.write(chalk.gray(data.toString()));
        });
        cmd.stderr.on('data', (data) => {
            const dataStr = data.toString();
            if (dataStr.indexOf('warning') === 0) {
                process.stdout.write(
                    chalk.yellow('warming') + dataStr.substring(7),
                );
            } else {
                process.stdout.write(chalk.red(data.toString()));
            }
        });
        cmd.on('close', resolve);
    });
}

start(getOptions());
