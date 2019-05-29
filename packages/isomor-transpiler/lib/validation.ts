import { exec, ChildProcess } from 'child_process';

interface Queue {
    args: string[];
    srcFilePath: string;
    path: string;
    name: string;
    className: string | undefined;
}

const queueList: Queue[] = [];
let process: ChildProcess;

export function pushToQueue(
    args: string[],
    srcFilePath: string,
    path: string,
    name: string,
    className: string | undefined,
) {
    if (args.length) {
        queueList.push({ args, srcFilePath, path, name, className });
        run();
    }
}

function run() {
    if (!process && queueList.length) {
        const { name, srcFilePath } = queueList.pop();
        const command = `isomor-json-schema-generator --path ${srcFilePath} --type ${name}`;
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
