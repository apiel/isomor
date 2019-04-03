import { info, error as err } from 'fancy-log';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { readdir, pathExists, lstat } from 'fs-extra';
import { join, parse } from 'path';
import { getFiles } from 'isomor-core';

interface Options {
    folder: string;
    port: number;
}

async function start(options: Options) {
    info('Starting server.');
    const app = express();
    const port = 3005;

    app.use(bodyParser.json());


    info('Start transpiling');
    const files = await getFiles(options.folder);
    files.forEach(file => {
        const functions = require(file);
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
    folder: process.env.FOLDER || join(__dirname, '../../isomor-transpiler/example'),
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3005,
});
