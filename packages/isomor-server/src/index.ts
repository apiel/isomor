import * as express from 'express';
import { parse } from 'path';
import { getFiles } from 'isomor-core';

export async function useIsomor(app: express.Express, distServerFolder: string): Promise<string[]> {
    const files = await getFiles(distServerFolder);
    return (files.map(file => {
        const functions = require(require.resolve(file, { paths: [process.cwd()] }));
        return Object.keys(functions).map(name => {
            const entrypoint = `/isomor/${parse(file).name}/${name}`;
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
