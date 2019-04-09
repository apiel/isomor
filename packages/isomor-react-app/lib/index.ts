#!/usr/bin/env node

import { info } from 'fancy-log'; // fancy log not so fancy, i want colors :D
import { copySync, readJSONSync, writeJSONSync, readFileSync, writeFileSync } from 'fs-extra';
import { join } from 'path';
import { spawn, execSync } from 'child_process';
import chalk from 'chalk';
import * as minimist from 'minimist';

interface Options {
    srcFolder: string;
    distAppFolder: string;
}

function start(options: Options) {
    const { srcFolder, distAppFolder } = options;
    info('Setup create-react-app with isomor');
    info('Install create-react-app');
    const { _: [projectDirectory] } = minimist(process.argv.slice(2));
    const npx = spawn('npx', ['create-react-app', projectDirectory, '--typescript']);
    npx.stdout.on('data', data => {
        process.stdout.write(chalk.gray(data.toString()));
    });
    npx.stderr.on('data', data => {
        const dataStr = data.toString();
        if (dataStr.indexOf('warning') === 0) {
            process.stdout.write(chalk.yellow('warming') + dataStr.substring(7));
        } else {
            process.stdout.write(chalk.red(data.toString()));
        }
    });
    npx.on('close', () => {
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
        const pkgExample = readJSONSync(join(__dirname, '..', '..', 'example', 'package.json'));
        pkg.scripts = pkgExample.scripts; // should make diff
        writeJSONSync(join(projectDirectory, 'package.json'), pkg);

        info('Install isomor-react');
        const output = execSync(`cd ${projectDirectory} && yarn add isomor isomor-react`);
        info(output.toString());

        info('Setup isomor-react in <App />');
        const index = `import { IsomorProvider } from 'isomor-react';\n`
            + readFileSync(join(projectDirectory, srcFolder, 'index.tsx')).toString();
        const newIndex = index.replace(/\<App \/\>/g, '(<IsomorProvider><App /></IsomorProvider>)');
        writeFileSync(join(projectDirectory, srcFolder, 'index.tsx'), newIndex);
        // update doc
    });
}

start({
    srcFolder: process.env.SRC_FOLDER || './src-isomor',
    distAppFolder: process.env.DIST_APP_FOLDER || './src',
});
