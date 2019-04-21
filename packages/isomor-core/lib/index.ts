import { pathExists } from 'fs-extra';
import { join, extname, resolve } from 'path';
import * as Glob from 'glob';
import { promisify } from 'util';

const glob = promisify(Glob);

export function getFilesPattern(
    folderToSearch: string,
): string {
    return join('**', folderToSearch, '*');
}

export async function getFiles(
    rootFolder: string,
    folderToSearch: string,
): Promise<string[]> {
    if (await pathExists(rootFolder)) {
        const files = await glob(getFilesPattern(folderToSearch), {
            nodir: true,
            cwd: rootFolder,
        });
        return files;
    }
    return [];
}

export async function getFolders(
    rootFolder: string,
    folderToSearch: string,
): Promise<string[]> {
    if (await pathExists(rootFolder)) {
        const files = await glob(join('**', folderToSearch), {
            cwd: rootFolder,
        });
        return files;
    }
    return [];
}

export function getPathForUrl(filePath: string) {
    const extensionLen = extname(filePath).length;
    return filePath.replace(/\//g, '-').slice(0, -extensionLen);
}
