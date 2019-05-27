#!/usr/bin/env node

const pkg = require('../../package.json'); // tslint:disable-line
require('please-upgrade-node')(pkg, {  // tslint:disable-line
    message: (v: string) => `
    ┌────────────────────────────────────────────────────────┐
    │  isomor-server requires at least version ${v} of Node.   │
    │                     Please upgrade.                    │
    └────────────────────────────────────────────────────────┘
    `,
});

import { info, error, success, log } from 'logol';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { setup, serve } from 'swagger-ui-express';
import * as morgan from 'morgan';

import { useIsomor, startup, getApiDoc } from '../lib';
import { join } from 'path';

interface Options {
    distServerFolder: string;
    serverFolder: string;
    port: number;
    staticFolder: string | null;
    startupFile: string;
    noDecorator: boolean;
}

const API_DOCS = '/api-docs';

async function start(options: Options) {
    const { distServerFolder, port, staticFolder, serverFolder, startupFile, noDecorator } = options;
    info('Starting server.');
    const app = express();

    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(morgan('tiny', { stream: { write: (str: string) => log(str.trim()) }}));

    await startup(app, distServerFolder, serverFolder, startupFile, info);

    const endpoints = await useIsomor(app, distServerFolder, serverFolder, noDecorator);
    info(`Created endpoints:`, endpoints.map(({ path }) => path));

    app.use(API_DOCS, serve, setup(await getApiDoc(endpoints)));

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
    startupFile: process.env.STARTUP_FILE || join('startup', 'index.js'),
    noDecorator: process.env.NO_DECORATOR === 'true',
});
