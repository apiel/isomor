#!/usr/bin/env node

import { info } from 'fancy-log'; // fancy log not so fancy, i want colors :D
import { copySync } from 'fs-extra';
import { join } from 'path';
import { execSync } from 'child_process';

interface Options {
    srcFolder: string;
    distAppFolder: string;
}

function start(options: Options) {
    info('Setup create-react-app with isomor');
    const output = execSync('npx create-react-app --help');
    console.log('output:', output.toString());
}

start({
    srcFolder: process.env.SRC_FOLDER || './src-isomor',
    distAppFolder: process.env.DIST_APP_FOLDER || './src',
});
