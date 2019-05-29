import { exec, ChildProcess } from 'child_process';
import { warn, info, error } from 'logol';

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
        info(`Queue JSON schema generation for ${name} in ${srcFilePath}`);
        queueList.push({ args, srcFilePath, path, name, className });
        run();
    }
}

function run() {
    if (!process && queueList.length) {
        const { name, srcFilePath } = queueList.pop();
        const command = `isomor-json-schema-generator --path ${srcFilePath} --type ${name}`;
        info(`Start JSON schema generation for ${name} in ${srcFilePath}...`);
        process = exec(command, (err, stdout, stderr) => {
            if (err) {
                error(err);
            }
            if (stderr) {
                warn(stderr);
            }
            // console.log(`stdout: ${stdout}`);
            info(`JSON schema generation finished for ${name} in ${srcFilePath}`);
            process = null;
            run();
        });
    }
}
