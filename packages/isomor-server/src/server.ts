#!/usr/bin/env node

import { info, error } from 'fancy-log';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { watch } from 'chokidar';
import { Server } from 'http';

import { useIsomor } from '.';
import { join } from 'path';

interface Options {
    distServerFolder: string;
    serverFolder: string;
    port: number;
    staticFolder: string | null;
    watch: boolean;
}

let server: Server;
let timer: NodeJS.Timeout;

async function start(options: Options) {
    const { distServerFolder, port, staticFolder, serverFolder } = options;
    info('Starting server.');
    const app = express();

    app.use(bodyParser.json());
    const endpoints = await useIsomor(app, distServerFolder, serverFolder);
    info('Created endpoints:', endpoints);

    if (staticFolder) {
        info('Add static folder', staticFolder);
        app.use(express.static(staticFolder));
    }

    server = app.listen(port, () => info(`Server listening on port ${port}!`));
    watcher(options);
}

function watcher(options: Options) {
    if (options.watch) {
        info('wait for file changes...');
        const { distServerFolder, serverFolder } = options;
        watch(join(distServerFolder, '**', serverFolder, '*'), {
            ignoreInitial: true,
        }).on('raw', () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                info('Detect changes: need to reload...', server.listening);
                if (server.listening) {
                    server.close((err) => {
                        if (err) {
                            error('Something went wrong while closing server', err);
                        } else {
                            info('Server closed');
                            start(options);
                        }
                    });
                } else {
                    start(options);
                }
            }, 500);
        });
    }
}

start({
    distServerFolder: process.env.DIST_SERVER_FOLDER || './dist-server',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3005,
    staticFolder: process.env.STATIC_FOLDER || null,
    serverFolder: process.env.SERVER_FOLDER || '/server',
    watch: process.env.WATCH === 'true',
});
