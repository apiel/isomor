"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const logol_1 = require("logol");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const isomor_1 = require("isomor");
const build_1 = require("./build");
const queueList = [];
let process;
function pushToQueue(args, srcFilePath, path, name, className) {
    const { jsonSchemaFolder } = build_1.getOptions();
    if (args.length && jsonSchemaFolder && jsonSchemaFolder.length) {
        logol_1.info(`Queue JSON schema generation for ${name} in ${srcFilePath}`);
        queueList.push({ args, srcFilePath, path, name, className });
        run();
    }
}
exports.pushToQueue = pushToQueue;
function run() {
    if (!process && queueList.length) {
        const { jsonSchemaFolder } = build_1.getOptions();
        const { name, srcFilePath, path } = queueList.pop();
        const command = `isomor-json-schema-generator --path ${srcFilePath} --type ${name}`;
        logol_1.info(`Start JSON schema generation for ${name} in ${srcFilePath} (might take few seconds)`);
        process = child_process_1.exec(command, (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                logol_1.error(err);
            }
            if (stderr) {
                logol_1.warn(stderr);
            }
            const jsonSchemaFileName = isomor_1.getJsonSchemaFileName(path, name);
            const jsonFile = path_1.join(jsonSchemaFolder, jsonSchemaFileName);
            yield fs_extra_1.outputJSON(jsonFile, JSON.parse(stdout), { spaces: 4 });
            logol_1.info(`JSON schema generation finished for ${name} in ${srcFilePath}`);
            process = null;
            run();
        }));
    }
}
//# sourceMappingURL=validation.js.map