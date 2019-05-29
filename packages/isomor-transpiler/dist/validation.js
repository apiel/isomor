"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const build_1 = require("./build");
const queueList = [];
let process;
function pushToQueue(args, srcFilePath, path, name, className) {
    if (args.length) {
        queueList.push({ args, srcFilePath, path, name, className });
        run();
    }
}
exports.pushToQueue = pushToQueue;
function run() {
    if (!process && queueList.length) {
        const { srcFolder } = build_1.getOptions();
        const { name, srcFilePath } = queueList.pop();
        const command = `isomor-json-schema-generator --path ${srcFilePath} --type ${name}`;
        console.log('command', command);
        process = child_process_1.exec(command, (error, stdout, stderr) => {
            console.error(`exec error: ${error}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            process = null;
            run();
        });
    }
}
//# sourceMappingURL=validation.js.map