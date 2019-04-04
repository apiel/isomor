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
    const { distServerFolder, port } = options;
    info('Starting server.');
    const app = express();

    app.use(bodyParser.json());

    const files = await getFiles(distServerFolder);
    files.forEach(file => {
        const functions = require(require.resolve(file, { paths: [process.cwd()] }));
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
                // console.log('result', result);
                return res.send(result);
            });
        });
    });

    app.listen(port, () => info(`Server listening on port ${port}!`));
}

start({
    distServerFolder: process.env.DIST_SERVER_FOLDER || './dist-server',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3005,
});
