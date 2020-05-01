import { info, error, success, log } from 'logol';
import * as logger from 'logol';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { setup, serve } from 'swagger-ui-express';
import * as morgan from 'morgan';
import { getOptions } from 'isomor-core';
import { join } from 'path';
import { Server } from 'http';

import { startup } from './startup';
import { getIsomorRoutes } from './route';
import { useIsomorHttp } from './use-isomor-http';
import { getApiDoc } from './apidoc';
import { useIsomorWs } from './use-isomor-ws';

const API_DOCS = '/api-docs';

export async function server(): Promise<{
    app: express.Express;
    server: Server;
}> {
    const {
        port,
        moduleName,
        staticFolder,
        wsTimeout,
        serverFolder,
        startupFile,
        jsonSchemaFolder,
    } = getOptions();
    info('Starting server.');
    const app = express();

    app.use(bodyParser.json());
    app.use(cookieParser());

    app.use(
        morgan('dev', {
            stream: { write: (str: string) => log(str.trim()) },
        }),
    );

    await startup(app, serverFolder, startupFile, info);

    const routes = await getIsomorRoutes(
        moduleName,
        serverFolder,
        jsonSchemaFolder,
    );
    useIsomorHttp(app, routes);
    info(
        `Created endpoints:`,
        routes.map(({ urlPath }) => urlPath),
    );

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

    app.use(
        (
            err: Error,
            req: express.Request,
            res: express.Response,
            next: express.NextFunction,
        ) => {
            error(err);
            res.status(500).send(err.message);
        },
    );

    const serv = app.listen(port, () => {
        success(`Server listening on port ${port}!`);
        info(`Find API documentation at http://127.0.0.1:${port}${API_DOCS}`);
    });

    useIsomorWs(routes, serv, wsTimeout, logger);

    return { app, server: serv };
}