import { exec, ChildProcess } from 'child_process';
import { getOptions } from './build';
import { join } from 'path';

interface Queue {
    args: string[];
    path: string;
    name: string;
    className: string | undefined;
}

const queueList: Queue[] = [];
let process: ChildProcess;

export function pushToQueue(
    args: string[],
    path: string,
    name: string,
    className: string | undefined,
) {
    queueList.push({ args, path, name, className });
    run();
}

function run() {
    if (!process && queueList.length) {
        const { srcFolder } = getOptions();
        const { name, path } = queueList.pop();
        const fullpath = join(srcFolder, path);
        const command = `isomor-json-schema-generator --path ${fullpath} --type ${name}`;
        console.log('command', command);
        process = exec(command, (error, stdout, stderr) => {
            console.error(`exec error: ${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            process = null;
            run();
        });
    }
}
