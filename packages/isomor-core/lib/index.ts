import { pathExists } from 'fs-extra';
import { join, extname, resolve } from 'path';
import * as Glob from 'glob';
import { promisify } from 'util';

const glob = promisify(Glob);

export function getFilesPattern(
    rootFolder: string,
    folderToSearch: string,
): string {
    return join(rootFolder, '**', folderToSearch, '*');
}

export function trimRootFolder(rootFolder: string) {
    const start = resolve(rootFolder).length;
    return (file: string) => file.substring(start).replace(/^\/|\/$/g, '');
}

export async function getFiles(
    rootFolder: string,
    folderToSearch: string,
): Promise<string[]> {
    if (await pathExists(rootFolder)) {
        const files = await glob(getFilesPattern(rootFolder, folderToSearch), { nodir: true });
        const trim = trimRootFolder(rootFolder);
        return files.map(file => trim(file));
    }
    return [];
}

export async function getFolders(
    rootFolder: string,
    folderToSearch: string,
): Promise<string[]> {
    if (await pathExists(rootFolder)) {
        const files = await glob(join(rootFolder, '**', folderToSearch));
        const trim = trimRootFolder(rootFolder);
        return files.map(file => trim(file));
    }
    return [];
}

export function getPathForUrl(filePath: string) {
    const extensionLen = extname(filePath).length;
    return filePath.replace(/\//g, '-').slice(0, -extensionLen);
}
