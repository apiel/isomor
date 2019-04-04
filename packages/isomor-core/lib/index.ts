import { readdir, pathExists, lstat } from 'fs-extra';
import { join } from 'path';

export async function getFiles(folder: string): Promise<string[]> {
    if (await pathExists(folder)) {
        const files = await readdir(folder);
        const onlyFiles = await Promise.all(
            files.map(async (file) => {
                const filePath = join(folder, file);
                const ls = await lstat(filePath);
                return ls.isFile() ? filePath : null;
            }));
        return onlyFiles.filter(file => file);
    }
}
