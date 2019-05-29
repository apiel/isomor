"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const logol_1 = require("logol");
const queueList = [];
let process;
function pushToQueue(args, srcFilePath, path, name, className) {
    if (args.length) {
        logol_1.info(`Queue JSON schema generation for ${name} in ${srcFilePath}`);
        queueList.push({ args, srcFilePath, path, name, className });
        run();
    }
}
exports.pushToQueue = pushToQueue;
function run() {
    if (!process && queueList.length) {
        const { name, srcFilePath } = queueList.pop();
        const command = `isomor-json-schema-generator --path ${srcFilePath} --type ${name}`;
        logol_1.info(`Start JSON schema generation for ${name} in ${srcFilePath}...`);
        process = child_process_1.exec(command, (err, stdout, stderr) => {
            if (err) {
                logol_1.error(err);
            }
            if (stderr) {
                logol_1.warn(stderr);
            }
            logol_1.info(`JSON schema generation finished for ${name} in ${srcFilePath}`);
            process = null;
            run();
        });
    }
}
//# sourceMappingURL=validation.js.map