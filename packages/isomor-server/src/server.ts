#!/usr/bin/env node

const pkg = require('../package.json'); // tslint:disable-line
require('please-upgrade-node')(pkg, {  // tslint:disable-line
    message: (v: string) => `
    ┌────────────────────────────────────────────────────────┐
    │  isomor-server requires at least version ${v} of Node.   │
    │                     Please upgrade.                    │
    └────────────────────────────────────────────────────────┘
    `,
});

import { info, error, success } from 'logol';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { setup, serve } from 'swagger-ui-express';

import { useIsomor, getSwaggerDoc } from '.';
import { join } from 'path';

interface Options {
    distServerFolder: string;
    serverFolder: string;
    port: number;
    staticFolder: string | null;
}

const API_DOCS = '/api-docs';

async function start(options: Options) {
    const { distServerFolder, port, staticFolder, serverFolder } = options;
    info('Starting server.');
    const app = express();

    app.use(bodyParser.json());
    app.use(cookieParser());

    app.use(API_DOCS, serve, setup(await getSwaggerDoc(distServerFolder, serverFolder)));

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

    app.use((
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) => {
        error(err);
        res.status(500).send(err.message);
    });

    app.listen(port, () => {
        success(`Server listening on port ${port}!`);
        info(`Find API documentation at http://127.0.0.1:${port}${API_DOCS}`);
    });
}

start({
    distServerFolder: process.env.DIST_SERVER_FOLDER || './dist-server',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3005,
    staticFolder: process.env.STATIC_FOLDER || null,
    serverFolder: process.env.SERVER_FOLDER || '/server',
});
