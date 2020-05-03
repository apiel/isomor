import { extname } from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { pathExists } from 'fs-extra';
import { Extensions } from './config';

const readdir = promisify(fs.readdir);

export { getOptions, Options } from './config';

export async function getFiles(
    folder: string,
    extensions: Extensions,
) {
    if (!(await pathExists(folder))) {
        return [];
    }
    const files = await readdir(folder, { withFileTypes: true });
    return files
        .filter((f) => f.isFile() && extensions.includes(extname(f.name)))
        .map((f) => f.name);
}
