import * as express from 'express';
import { getFiles, getPathForUrl } from 'isomor-core';
import { join } from 'path';

export async function useIsomor(
    app: express.Express,
    distServerFolder: string,
    serverFolder: string,
): Promise<string[]> {
    const files = await getFiles(distServerFolder, serverFolder);
    return (files.map(file => {
        const filepath = require.resolve(
            join(distServerFolder, file),
            { paths: [process.cwd()] },
        );
        delete require.cache[filepath];
        const functions = require(filepath);
        return Object.keys(functions).map(name => {
            const entrypoint = `/isomor/${getPathForUrl(file)}/${name}`;
            app.use(entrypoint, async (req: any, res: any) => {
                const result = req.body && req.body.args
                    ? await functions[name](...req.body.args)
                    : await functions[name]();
                return res.send(result);
            });
            return entrypoint;
        });
    }) as any).flat();
}
