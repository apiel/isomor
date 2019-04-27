#!/usr/bin/env node

import { info, warn, error } from 'fancy-log'; // fancy log not so fancy, i want colors :D
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
        info('Setup create-react-app with isomor');
        let { _: [projectDirectory] } = minimist(process.argv.slice(2));
        projectDirectory = join(process.cwd(), projectDirectory);
        info('Install create-react-app in', projectDirectory);
        if (!projectDirectory) {
            warn(`${chalk.yellow('Please provide the project directory')} e.g: npx isomor-react-app my-app`);
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

        info('Install react-async-cache');
        writeFileSync('cmd', `cd ${projectDirectory} && yarn add isomor react-async-cache && yarn add run-server nodemon --dev`);
        await shell('bash', ['cmd']);
        unlinkSync('cmd');

        info('Setup react-async-cache in <App />');
        const index = `import { AsyncCacheProvider } from 'react-async-cache';\n`
            + readFileSync(join(projectDirectory, srcFolder, 'index.tsx')).toString();
        const newIndex = index.replace(/\<App \/\>/g, '(<AsyncCacheProvider><App /></AsyncCacheProvider>)');
        writeFileSync(join(projectDirectory, srcFolder, 'index.tsx'), newIndex);

        info('Create empty server/data.ts');
        outputFileSync(join(projectDirectory, srcFolder, serverFolder, 'data.ts'), ''); // we could have an example

        info(`Ready to code :-) ${chalk.bold(chalk.red('Important: ') + chalk.blue(`edit you code in ${srcFolder}`))} instead of ${distAppFolder}`);
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
