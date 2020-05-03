import { exec, ChildProcess } from 'child_process';
import { info, error } from 'logol';
import { join } from 'path';
import { remove } from 'fs-extra';
import { getOptions } from 'isomor-core';
import { eventEmitter, Action } from './event';

let process: ChildProcess;
const queueList: string[] = [];

export function watchForValidation() {
    eventEmitter.on(Action.UpdateTs, pushToQueue);
}

export async function pushToQueue(file: string) {
    const { noValidation } = getOptions();
    if (!noValidation) {
        info(`Queue JSON schema generation for ${file}`);
        // const destination = getDestFile(file);
        // await remove(destination);
        queueList.push(file);
        run();
    }
}

function run() {
    if (!process && queueList.length) {
        const file = queueList.pop();
        const destination = getDestFile(file);
        const command = `isomor-json-schema-generator ${file} ${destination}`;
        info(`Start JSON schema generation for ${file}`);
        // console.log('command', command);
        process = exec(command, async (err) => {
            if (err) {
                error(err);
            }
            info(`JSON schema generation finished`, destination);
            process = null;
            run();
        });
    }
}

function getDestFile(file: string) {
    const { serverFolder, srcFolder } = getOptions();
    return join(serverFolder, file.substr(srcFolder.length) + '.json');
}
