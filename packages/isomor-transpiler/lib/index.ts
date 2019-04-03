import { info, error as err } from 'fancy-log'; // fancy log not so fancy, i want colors :D
import { readdir, pathExists, lstat, readFile } from 'fs-extra';
import { join } from 'path';

// only support "function" not array func
const finFuncPattern = /export(\s+async){0,1}\s+function\s+(.*)\(.*\).*\s*\{/gim;

async function transpile(file: string) {
    info('Transpile', file);
    const content = (await readFile(file)).toString();

    while (true) {
        const findFunc = finFuncPattern.exec(content);
        if (findFunc) {
            console.log('findFunc', findFunc);
        } else {
            break;
        }
    }
}

async function start(folder: string) {
    info('Start transpiling');
    if (!(await pathExists(folder))) {
        err('Folder does not exist', folder);
    } else {
        const files = await readdir(folder);
        files.forEach(async (file) => {
            const filePath = join(folder, file);
            const ls = await lstat(filePath);
            if (ls.isFile()) {
                transpile(filePath);
            }
        });
    }

}

start(join(__dirname, '../example'));
