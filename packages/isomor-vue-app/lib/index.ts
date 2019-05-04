#!/usr/bin/env node

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
import chalk from 'chalk';
import * as minimist from 'minimist';

interface Options {
    srcFolder: string;
    distAppFolder: string;
    serverFolder: string;
}

async function start({ srcFolder, distAppFolder, serverFolder }: Options) {
    try {
        info('Setup create-vue-app with isomor');
        const { _: [projectName] } = minimist(process.argv.slice(2));
        const projectDirectory = join(process.cwd(), projectName);
        info('Install VueJs in', projectDirectory);
        info('Wait a little bit... we are loading Vue cli');
        if (!projectDirectory) {
            warn(`Please provide the project directory, e.g: npx isomor-vue-app my-app`);
            return;
        }

        if (process.env.MANUAL === 'true') {
            info('For the moment the installer work only for TypeScript. Please select TypeScript :-)');
            await shell('npx', ['@vue/cli', 'create', projectName]);
        } else {
            const vuePreset = readJSONSync(join(__dirname, '..', 'vue-preset.json'));
            await shell('npx', ['@vue/cli', 'create', projectName, '-i', JSON.stringify(vuePreset)]);
        }

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
        const pkgExample = readJSONSync(join(__dirname, '..', 'package-copy.json'));
        if (pkgExample.scripts['run-in-docker']) { delete pkgExample.scripts['run-in-docker']; }
        pkg.scripts = { ...pkgExample.scripts, ...pkg.scripts };
        writeJSONSync(join(projectDirectory, 'package.json'), pkg);

        info('Install packages...');
        writeFileSync('cmd', `cd ${projectDirectory} && yarn add isomor vue-async-cache && yarn add run-screen nodemon --dev`);
        await shell('bash', ['cmd']);
        unlinkSync('cmd');

        info('Create empty server/data.ts');
        outputFileSync(join(projectDirectory, srcFolder, serverFolder, 'data.ts'), ``);

        info('Copy example component');
        copySync(join(__dirname, '..', 'example'), join(projectDirectory, srcFolder, 'components'));

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
        let cmd = spawn(command, args, {
            env: {
                FORCE_COLOR: 'true',
                COLUMNS: process.stdout.columns.toString(),
                LINES: process.stdout.rows.toString(),
                ...process.env,
            },
        });
        cmd.stdout.on('data', data => {
            process.stdout.write(data);
        });
        cmd.stderr.on('data', data => {
            const dataStr = data.toString();
            if (dataStr.indexOf('warning') === 0) {
                process.stdout.write(chalk.yellow('warming') + dataStr.substring(7));
            } else {
                process.stdout.write(chalk.red(data.toString()));
            }
        });

        process.stdin.setEncoding('ascii');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', (key) => {
            if (key === '\u0003') { process.exit(); } // we might have to kill child process as well
            if (cmd) { cmd.stdin.write(key); }
        });
        cmd.on('close', () => { cmd = null; resolve(); });
    });
}

start({
    srcFolder: process.env.SRC_FOLDER || './src-isomor',
    distAppFolder: process.env.DIST_APP_FOLDER || './src',
    serverFolder: process.env.SERVER_FOLDER || '/server',
});
