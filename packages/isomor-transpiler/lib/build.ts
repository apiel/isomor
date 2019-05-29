import { info, warn } from 'logol';
import { readFile, outputFile, emptyDir, copy, unlink } from 'fs-extra';
import { join } from 'path';
import debug from 'debug';
import {
    getFiles,
    getFolders,
    getPathForUrl,
    getFilesPattern,
} from 'isomor-core';
import { watch } from 'chokidar';
import anymatch from 'anymatch';
import { parse, generate } from './ast';

import transform from './transform';

export default transform;

export interface Options {
    srcFolder: string;
    distAppFolder: string;
    serverFolder: string;
    withTypes: boolean;
    watchMode: boolean;
    noServerImport: boolean;
    noDecorator: boolean;
}

export function getOptions(): Options {
    return {
        srcFolder: process.env.SRC_FOLDER || './src-isomor',
        distAppFolder: process.env.DIST_APP_FOLDER || './src',
        serverFolder: process.env.SERVER_FOLDER || '/server',
        withTypes: process.env.NO_TYPES !== 'true',
        watchMode: process.env.WATCH === 'true',
        noServerImport: process.env.NO_SERVER_IMPORT === 'true',
        noDecorator: process.env.NO_DECORATOR === 'true',
    };
}

function getCode(options: Options, srcFilePath: string, path: string, content: string) {
    const { withTypes, noServerImport, noDecorator } = options;
    const { program } = parse(content);
    program.body = transform(program.body, srcFilePath, path, withTypes, noServerImport, noDecorator);
    const { code } = generate(program as any);

    return code;
}

async function transpile(options: Options, filePath: string) {
    const { distAppFolder, srcFolder } = options;

    info('Transpile', filePath);
    const srcFilePath = join(srcFolder, filePath);
    const buffer = await readFile(srcFilePath);
    debug('isomor-transpiler:transpile:in')(buffer.toString());

    const code = getCode(options, srcFilePath, getPathForUrl(filePath), buffer.toString());

    const appFilePath = join(distAppFolder, filePath);
    info('Save isomor file', appFilePath);
    await outputFile(appFilePath, code);
    debug('isomor-transpiler:transpile:out')(code);
}

async function prepare(options: Options) {
    const { srcFolder, distAppFolder, serverFolder } = options;

    info('Prepare folders');
    await emptyDir(distAppFolder);
    await copy(srcFolder, distAppFolder);

    const folders = await getFolders(srcFolder, serverFolder);
    await Promise.all(folders.map(folder => emptyDir(join(distAppFolder, folder))));
}

export async function build(options: Options) {
    await prepare(options);

    info('Start transpiling');

    const { srcFolder, serverFolder } = options;
    const files = await getFiles(srcFolder, serverFolder);
    info(`Found ${files.length} file(s).`);
    await Promise.all(files.map(file => transpile(options, file)));

    watcher(options);
}

function getServerSubFolderPattern(serverFolderPattern: string) {
    return join(serverFolderPattern, '**', '*');
}

export const watcherUpdate = (
    options: Options,
) => async (file: string) => {
    const { srcFolder, serverFolder, distAppFolder, watchMode } = options;
    const serverFolderPattern = getFilesPattern(serverFolder);
    const path = join(srcFolder, file);

    if (anymatch(getServerSubFolderPattern(serverFolderPattern), path)) {
        info(`Do not copy sub-folder from "./server"`, path);
    } else if (anymatch(serverFolderPattern, path)) {
        transpile(options, file);
    } else {
        info(`Copy ${path} to folder`);
        const dest = join(distAppFolder, file);
        copy(path, dest);
        // const content = await readFile(path);
        // await outputFile(dest, content);

        if (watchMode) {
            // try to fix file that does not get copy correctly
            setTimeout(() => watcherUpdateSpy(path, dest), 200); // should not be necessary anymore
        }
    }
};

async function watcherUpdateSpy(path: string, dest: string, retry = 0) {
    const contentA = await readFile(path);
    const contentB = await readFile(dest);
    if (contentA.toString() !== contentB.toString()) {
        warn('We found file diff, copy again', dest);
        await outputFile(dest, contentA);
        if (retry < 2) {
            setTimeout(() => watcherUpdateSpy(path, dest, retry + 1), 200);
        }
    }
}

function watcher(options: Options) {
    const { srcFolder, serverFolder, watchMode, distAppFolder } = options;
    if (watchMode) {
        info('Starting watch mode.');
        const serverFolderPattern = getFilesPattern(serverFolder);
        watch('.', {
            ignoreInitial: true,
            ignored: getServerSubFolderPattern(serverFolderPattern),
            cwd: srcFolder,
            usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
        }).on('ready', () => info('Initial scan complete. Ready for changes...'))
            .on('add', file => {
                info(`File ${file} has been added`);
                // watcherUpdate(file);
                setTimeout(() => watcherUpdate(options)(file), 100);
            }).on('change', file => {
                info(`File ${file} has been changed`);
                // watcherUpdate(file);
                setTimeout(() => watcherUpdate(options)(file), 100);
            }).on('unlink', file => {
                info(`File ${file} has been removed`, '(do nothing)');
                const path = join(distAppFolder, file);
                unlink(path);
            });
    }
}
