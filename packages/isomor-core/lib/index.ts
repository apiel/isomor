import { pathExists } from 'fs-extra';
import { join, extname } from 'path';
import * as Glob from 'glob';
import { promisify } from 'util';

const glob = promisify(Glob);

export function getFilesPattern(
    rootFolder: string,
    folderToSearch: string,
): string {
    return join(rootFolder, '**', folderToSearch, '*');
}

export async function getFiles(
    rootFolder: string,
    folderToSearch: string,
): Promise<string[]> {
    if (await pathExists(rootFolder)) {
        const files = await glob(getFilesPattern(rootFolder, folderToSearch), { nodir: true });
        const start = rootFolder.length - 1;
        return files.map(file => file.substring(start));
    }
    return [];
}

export async function getFolders(
    rootFolder: string,
    folderToSearch: string,
): Promise<string[]> {
    if (await pathExists(rootFolder)) {
        const files = await glob(join(rootFolder, '**', folderToSearch));
        const start = rootFolder.length - 1;
        return files.map(file => file.substring(start));
    }
    return [];
}

export function getPathForUrl(filePath: string) {
    const extensionLen = extname(filePath).length;
    return filePath.replace(/\//g, '-').slice(0, -extensionLen);
}
