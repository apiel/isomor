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
const isomor_core_1 = require("isomor-core");
const queueList = [];
let process;
function setValidator(paramRoot, srcFilePath, path, name, className) {
    const args = paramRoot.params.map((param) => {
        if (param.type === 'Identifier') {
            return param.name;
        }
        else if (param.type === 'AssignmentPattern' && param.left.type === 'Identifier') {
            return param.left.name;
        }
        else if (param.type === 'RestElement' && param.argument.type === 'Identifier') {
            return param.argument.name;
        }
    }).filter(param => param);
    if (args.length !== paramRoot.params.length) {
        logol_1.warn('Validatormight not recognize one of your params type. \
            Please report the warning at https://github.com/apiel/isomor/issues', srcFilePath, name);
    }
    pushToQueue(args, srcFilePath, path, name, className);
    return args;
}
exports.setValidator = setValidator;
function validationIsActive() {
    const { jsonSchemaFolder, noValidation } = isomor_core_1.getOptions();
    return !noValidation && jsonSchemaFolder && jsonSchemaFolder.length;
}
function pushToQueue(args, srcFilePath, path, name, className) {
    if (args.length && validationIsActive()) {
        logol_1.info(`Queue JSON schema generation for ${name} in ${srcFilePath}`);
        queueList.push({ args, srcFilePath, path, name, className });
        run();
    }
}
exports.pushToQueue = pushToQueue;
function run() {
    if (!process && queueList.length) {
        const { jsonSchemaFolder } = isomor_core_1.getOptions();
        const { name, srcFilePath, path, args, className } = queueList.pop();
        const typeName = className ? `${className}.${name}` : name;
        const command = `isomor-json-schema-generator --path ${srcFilePath} --type ${typeName}`;
        logol_1.info(`Start JSON schema generation for ${name} in ${srcFilePath} (might take few seconds)`);
        process = child_process_1.exec(command, (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                logol_1.error(err);
            }
            if (stderr) {
                logol_1.warn(stderr);
            }
            if (stdout && stdout.length) {
                const jsonSchemaFileName = isomor_core_1.getJsonSchemaFileName(path, name, className);
                const jsonFile = path_1.join(jsonSchemaFolder, jsonSchemaFileName);
                const data = {
                    args,
                    schema: JSON.parse(stdout),
                    name: typeName,
                };
                yield fs_extra_1.outputJSON(jsonFile, data, { spaces: 4 });
                logol_1.info(`JSON schema generation finished for ${name} in ${srcFilePath}`);
            }
            else {
                logol_1.warn(`JSON schema generation empty for ${name} in ${srcFilePath}`);
            }
            process = null;
            run();
        }));
    }
}
//# sourceMappingURL=validation.js.map