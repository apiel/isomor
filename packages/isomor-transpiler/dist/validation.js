"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const build_1 = require("./build");
const path_1 = require("path");
const queueList = [];
let process;
function pushToQueue(args, path, name, className) {
    queueList.push({ args, path, name, className });
    run();
}
exports.pushToQueue = pushToQueue;
function run() {
    if (!process && queueList.length) {
        const { srcFolder } = build_1.getOptions();
        const { name, path } = queueList.pop();
        const fullpath = path_1.join(srcFolder, path);
        const command = `isomor-json-schema-generator --path ${fullpath} --type ${name}`;
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