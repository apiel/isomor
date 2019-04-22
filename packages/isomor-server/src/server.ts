#!/usr/bin/env node

import { info } from 'fancy-log';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import { useIsomor } from '.';
import { join } from 'path';

interface Options {
    distServerFolder: string;
    serverFolder: string;
    port: number;
    staticFolder: string | null;
}

async function start(options: Options) {
    const { distServerFolder, port, staticFolder, serverFolder } = options;
    info('Starting server.');
    const app = express();

    app.use(bodyParser.json());
    app.use(cookieParser());

    const endpoints = await useIsomor(app, distServerFolder, serverFolder);
    info('Created endpoints:', endpoints);

    if (staticFolder) {
        info('Add static folder', staticFolder);
        app.use(express.static(staticFolder));
        app.get('*', (req, res) =>
            res.sendFile(join(staticFolder, 'index.html'), {
                root: process.cwd(),
            }),
        );
    }

    app.listen(port, () => info(`Server listening on port ${port}!`));
}

start({
    distServerFolder: process.env.DIST_SERVER_FOLDER || './dist-server',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3005,
    staticFolder: process.env.STATIC_FOLDER || null,
    serverFolder: process.env.SERVER_FOLDER || '/server',
});
