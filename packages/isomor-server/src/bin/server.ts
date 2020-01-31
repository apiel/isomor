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
import * as logger from 'logol';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { setup, serve } from 'swagger-ui-express';
import * as morgan from 'morgan';
import { getOptions } from 'isomor-core';

import { useIsomor, startup, getApiDoc, useIsomorWs } from '../lib';
import { join } from 'path';

const API_DOCS = '/api-docs';

async function start() {
    const { distServerFolder, port, staticFolder,
        serverFolder, startupFile, noDecorator, jsonSchemaFolder } = getOptions();
    info('Starting server.');
    const app = express();

    app.use(bodyParser.json());
    app.use(cookieParser());

    app.use(morgan('dev', {
        stream: { write: (str: string) => log(str.trim()) },
    }));

    await startup(app, distServerFolder, serverFolder, startupFile, info);

    const routes = await useIsomor(app, distServerFolder, serverFolder, jsonSchemaFolder, noDecorator);
    info(`Created endpoints:`, routes.map(({ path }) => path));

    app.use(API_DOCS, serve, setup(getApiDoc(routes)));

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

    const server = app.listen(port, () => {
        success(`Server listening on port ${port}!`);
        info(`Find API documentation at http://127.0.0.1:${port}${API_DOCS}`);
    });

    useIsomorWs(routes, server, logger);
}

start();
