import { readdir, pathExists, lstat } from 'fs-extra';
import { join } from 'path';

export async function getFiles(folder: string): Promise<string[]> {
    if (await pathExists(folder)) {
        const files = await readdir(folder);
        return Promise.all(files.map((file) => join(folder, file))
            .filter(async (filePath) => {
                const ls = await lstat(filePath);
                return ls.isFile();
            }));
    }
}
