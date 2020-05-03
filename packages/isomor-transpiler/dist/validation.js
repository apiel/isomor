"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const logol_1 = require("logol");
const path_1 = require("path");
const isomor_core_1 = require("isomor-core");
const event_1 = require("./event");
let process;
const queueList = [];
function watchForValidation() {
    event_1.eventEmitter.on(event_1.Action.UpdateTs, pushToQueue);
}
exports.watchForValidation = watchForValidation;
function pushToQueue(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const { noValidation } = isomor_core_1.getOptions();
        if (!noValidation) {
            logol_1.info(`Queue JSON schema generation for ${file}`);
            queueList.push(file);
            run();
        }
    });
}
exports.pushToQueue = pushToQueue;
function run() {
    if (!process && queueList.length) {
        const file = queueList.pop();
        const destination = getDestFile(file);
        const command = `isomor-json-schema-generator ${file} ${destination}`;
        logol_1.info(`Start JSON schema generation for ${file}`);
        process = child_process_1.exec(command, (err) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                logol_1.error(err);
            }
            logol_1.info(`JSON schema generation finished`, destination);
            process = null;
            run();
        }));
    }
}
function getDestFile(file) {
    const { serverFolder, srcFolder } = isomor_core_1.getOptions();
    return path_1.join(serverFolder, file.substr(srcFolder.length) + '.json');
}
//# sourceMappingURL=validation.js.map