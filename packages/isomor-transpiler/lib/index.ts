import { info, error as err } from 'fancy-log'; // fancy log not so fancy, i want colors :D
import { readdir, pathExists, lstat, readFile, outputFile } from 'fs-extra';
import { join } from 'path';

interface Options {
    folder: string;
    serverFolder: string;
    appFolder: string;
}

interface Func {
    name: string;
    code: string;
}

function getFunctions(content: string) {
    const functions: Func[] = [];
    // only support "function" not array func
    const finFuncPattern = /export(\s+async){0,1}\s+function\s+(.*)\(.*\).*\s*\{/gim;
    // it's hardly possible to conver all poissibilty just with regex
    // will need to create a more complex parser, maybe combine with prettier
    // https://github.com/prettier/prettier/blob/master/src/language-js/parser-typescript.js
    // or even better maybe just
    // @typescript-eslint/typescript-estree
    while (true) {
        const findFunc = finFuncPattern.exec(content);
        if (findFunc) {
            functions.push({ name: findFunc[2], code: findFunc[0] });
        } else {
            break;
        }
    }
    return functions;
}

async function transpile(options: Options, file: string) {
    const { folder, appFolder } = options;
    const filePath = join(folder, file);

    info('Transpile', file);
    const buffer = await readFile(filePath);
    const functions = getFunctions(buffer.toString());
    // console.log('functions', functions);

    const appFunctions = functions.map(
        ({ code, name }) => `${code}\n  return remote('${name}', arguments);\n}\n`,
    );
    const appCode = `import { remote } from 'isomor';\n\n${appFunctions.join(`\n`)}`;
    const appFilePath = join(appFolder, file);
    await outputFile(appFilePath, appCode);
}

async function start(options: Options) {
    const { folder } = options;
    info('Start transpiling');
    if (!(await pathExists(folder))) {
        err('Folder does not exist', folder);
    } else {
        const files = await readdir(folder);
        files.forEach(async (file) => {
            const filePath = join(folder, file);
            const ls = await lstat(filePath);
            if (ls.isFile()) {
                transpile(options, file);
            }
        });
    }

}

start({
    folder: join(__dirname, '../example'),
    serverFolder: join(__dirname, '../dist-server'),
    appFolder: join(__dirname, '../dist-app'),
});
