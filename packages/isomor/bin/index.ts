#!/usr/bin/env node

import { prompt } from 'inquirer';
import { spawn } from 'child_process';
import * as chalk from 'chalk';
import { platform } from 'process';

const REACT = 'React';
const NG = 'Angular + Nest';
const VUE = 'Vue';

async function start() {
    const npx = platform === 'win32' ? 'npx.cmd' : 'npx';

    const { framework, name } = await prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of your project:',
            default: () => 'my-app',
        },
        {
            type: 'list',
            name: 'framework',
            message: 'Select which library you want to use?',
            choices: [
                REACT,
                VUE,
                NG,
            ],
        },
    ]);
    if (framework === REACT) {
        await shell(npx, ['isomor-react-app', name]);
    } else if (framework === NG) {
        await shell(npx, ['isomor-ng-nest', name]);
    } else if (framework === VUE) {
        await shell(npx, ['isomor-vue-app', name]);
    }
    process.exit();
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
        process.stdin.on('data', (key: any) => {
            if (key === '\u0003') { process.exit(); } // we might have to kill child process as well
            if (cmd) { cmd.stdin.write(key); }
        });
        cmd.on('close', () => { cmd = null; resolve(); });
    });
}

start();
