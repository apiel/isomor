#!/usr/bin/env node

import { info } from 'fancy-log';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { useIsomor } from '.';

interface Options {
    distServerFolder: string;
    port: number;
}

async function start(options: Options) {
    const { distServerFolder, port } = options;
    info('Starting server.');
    const app = express();

    app.use(bodyParser.json());
    const endpoints = await useIsomor(app, distServerFolder);
    info('Created endpoints:', endpoints);

    app.listen(port, () => info(`Server listening on port ${port}!`));
}

start({
    distServerFolder: process.env.DIST_SERVER_FOLDER || './dist-server',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3005,
});
