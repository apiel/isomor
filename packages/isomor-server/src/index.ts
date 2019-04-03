import { info, error as err } from 'fancy-log';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { readdir, pathExists, lstat } from 'fs-extra';
import { join } from 'path';

interface Options {
    folder: string;
}

// should move this in core
async function getFiles(options: Options) {
    const { folder } = options;
    if (!(await pathExists(folder))) {
        err('Folder does not exist', folder);
    } else {
        const files = await readdir(folder);
        return Promise.all(files.map((file) => join(folder, file))
            .filter(async (filePath) => {
                const ls = await lstat(filePath);
                return ls.isFile();
            }));
    }
}

async function start(options: Options) {
    info('Starting server.')
    const app = express();
    const port = 3005;

    app.use(bodyParser.json());


    info('Start transpiling');
    const files = await getFiles(options);
    files.forEach(file => {
        const functions = require(file);
        Object.keys(functions).forEach(name => {
            app.use(`/isomor/${name}`, async (req: any, res: any) => {
                // console.log('call', name);
                // console.log('fn', functions[name]);
                // console.log('body', req.body);
                const result = req.body && req.body.arguments
                    ? await functions[name](...req.body.arguments)
                    : await functions[name]();
                return res.send(result);
            });
        });
    });

    app.listen(port, () => info(`Server listening on port ${port}!`));
}

start({
    folder: join(__dirname, '../../isomor-transpiler/example'),
});

