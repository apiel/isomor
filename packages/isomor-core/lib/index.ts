import { pathExists } from 'fs-extra';
import { join, extname } from 'path';
import * as Glob from 'glob';
import { promisify } from 'util';
import * as findUp from 'find-up';

export { getOptions, Options } from './config';

const glob = promisify(Glob);

export interface ValidationSchema {
    args: string[];
    schema: any;
    name: string;
}

export function getJsonSchemaFileName(
    path: string,
    name: string,
    className?: string,
) {
    return className ?  `${path}.${className}.${name}.json` : `${path}.${name}.json`;
}

export function getFilesPattern(
    folderToSearch: string,
): string {
    return process.env.FILES_PATTERN || join('**', folderToSearch, '*');
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

export function getPathForUrl(path: string) {
    const len = path.length - extname(path).length;
    return path.replace(/\//g, '-').slice(0, len).replace(/^-|-$/g, '');
}

export function getPkgName(cwd: string) {
    let pkgName = 'root';
    if (process.env.PKG_NAME) {
        pkgName = process.env.PKG_NAME;
    } else {
        const found = findUp.sync('package.json', { cwd });
        if (found) {
            const pkg = require(found);
            if (pkg.name) {
                pkgName = pkg.name;
            }
        }
    }
    return pkgName;
}
