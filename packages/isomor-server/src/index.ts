#!/usr/bin/env node

import { info } from 'fancy-log';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { parse, join } from 'path';
import { getFiles } from 'isomor-core';

interface Options {
    distServerFolder: string;
    port: number;
}

async function start(options: Options) {
    info('Starting server.');
    const app = express();
    const port = 3005;

    app.use(bodyParser.json());

    const { distServerFolder } = options;
    const files = await getFiles(distServerFolder);
    files.forEach(file => {
        const functions = require(join(process.cwd(), file));
        Object.keys(functions).forEach(name => {
            const entrypoint = `/isomor/${parse(file).name}/${name}`;
            info('Create entrypoint:', entrypoint);
            app.use(entrypoint, async (req: any, res: any) => {
                // console.log('call', name);
                // console.log('fn', functions[name]);
                // console.log('body', req.body);
                const result = req.body && req.body.args
                    ? await functions[name](...req.body.args)
                    : await functions[name]();
                return res.send(result);
            });
        });
    });

    app.listen(options.port, () => info(`Server listening on port ${port}!`));
}

start({
    distServerFolder: process.env.DIST_SERVER_FOLDER || './dist-server',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3005,
});
