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
import * as chalk from 'chalk';
import * as minimist from 'minimist';

interface Options {
    srcFolder: string;
    distAppFolder: string;
    serverFolder: string;
}

async function start({ srcFolder, distAppFolder, serverFolder }: Options) {
    try {
        info('Setup create-react-app with isomor');
        let { _: [projectDirectory] } = minimist(process.argv.slice(2));
        projectDirectory = join(process.cwd(), projectDirectory);
        info('Install create-react-app in', projectDirectory);
        if (!projectDirectory) {
            warn(`Please provide the project directory, e.g: npx isomor-react-app my-app`);
            return;
        }
        await shell('npx', ['create-react-app', projectDirectory, '--typescript']);

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
        pkg.proxy = 'http://127.0.0.1:3005';
        const pkgExample = readJSONSync(join(__dirname, '..', 'package-copy.json'));
        if (pkgExample.scripts['run-in-docker']) { delete pkgExample.scripts['run-in-docker']; }
        pkg.scripts = { ...pkgExample.scripts, ...pkg.scripts };
        writeJSONSync(join(projectDirectory, 'package.json'), pkg);

        info('Install packages...');
        writeFileSync('cmd', `cd ${projectDirectory} && \
            yarn add run-screen nodemon isomor-transpiler isomor-server  yarn --dev`);
        await shell('bash', ['cmd']);
        unlinkSync('cmd');

        info('Create empty server/data.ts');
        outputFileSync(join(projectDirectory, srcFolder, serverFolder, 'data.ts'), ``);

        info('Copy example component');
        copySync(join(__dirname, '..', 'example'), join(projectDirectory, srcFolder, 'uptime'));
        const AppContent = readFileSync(join(projectDirectory, srcFolder, 'App.tsx')).toString();
        const AppWithUptime = AppContent.replace('</p>', `</p>\n<Uptime />\n`);
        const App = `import { Uptime } from './uptime/uptime';\n` + AppWithUptime;
        writeFileSync(join(projectDirectory, srcFolder, 'App.tsx'), App);

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

start({
    srcFolder: process.env.SRC_FOLDER || './src-isomor',
    distAppFolder: process.env.DIST_APP_FOLDER || './src',
    serverFolder: process.env.SERVER_FOLDER || '/server',
});
