#!/usr/bin/env node

const pkg = require('../../package.json'); // tslint:disable-line
// tslint:disable-next-line
require('please-upgrade-node')(pkg, {
    message: (v: string) => `
    ┌────────────────────────────────────────────────────────┐
    │  isomor-server requires at least version ${v} of Node.   │
    │                     Please upgrade.                    │
    └────────────────────────────────────────────────────────┘
    `,
});

import { watch } from 'chokidar';
import { getOptions } from 'isomor-core';
import { info } from 'logol';

import { server } from '../lib';
import { Server } from 'http';

const options = getOptions();
if (process.argv.includes('--watch')) {
    options.watchMode = true;
}

let watchedServer: Server = null;
let watcherTimer: NodeJS.Timeout;

if (options.watchMode) {
    watcher();
} else {
    server(options);
}

function watcher() {
    watcherStartServer();
    watch('.', {
        ignoreInitial: true,
        cwd: options.serverFolder,
        usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
    })
        .on('ready', () => info('Watching for changes...'))
        .on('add', watcherStartServer)
        .on('change', watcherStartServer);
}

function watcherStartServer() {
    clearTimeout(watcherTimer);
    watcherTimer = setTimeout(async () => {
        if (watchedServer) {
            await new Promise((resolve) => watchedServer.close(resolve));
        }
        watchedServer = (await server(options)).server;
    }, 50);
}
