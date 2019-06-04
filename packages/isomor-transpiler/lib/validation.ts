import { exec, ChildProcess } from 'child_process';
import { warn, info, error } from 'logol';
import { join } from 'path';
import { outputJSON } from 'fs-extra';
import { ValidationSchema, getJsonSchemaFileName } from 'isomor-core';

import { getOptions } from './build';
import { JsonAst, FunctionDeclaration, ClassMethod, ArrowFunctionExpression } from './ast';

type RootParams = FunctionDeclaration | ClassMethod | ArrowFunctionExpression;

interface Queue {
    args: string[];
    srcFilePath: string;
    path: string;
    name: string;
    className: string | undefined;
}

const queueList: Queue[] = [];
let process: ChildProcess;

export function setValidator(
    paramRoot: RootParams,
    srcFilePath: string,
    path: string,
    name: string,
    className?: string,
) {
    const args = paramRoot.params.map((param) => {
        if (param.type === 'Identifier') {
            return param.name;
        } else if (param.type === 'AssignmentPattern' && param.left.type === 'Identifier') {
            return param.left.name;
        } else if (param.type === 'RestElement' && param.argument.type === 'Identifier') {
            return param.argument.name;
        }
    }).filter(param => param);
    if (args.length !== paramRoot.params.length) {
        warn('Validatormight not recognize one of your params type. \
            Please report the warning at https://github.com/apiel/isomor/issues', srcFilePath, name);
        // console.log('paramRoot', JsonAst(paramRoot));
    }
    pushToQueue(args, srcFilePath, path, name, className);
    return args;
}

function validationIsActive() {
    const { jsonSchemaFolder, noValidation } = getOptions();
    return !noValidation && jsonSchemaFolder && jsonSchemaFolder.length;
}

export function pushToQueue(
    args: string[],
    srcFilePath: string,
    path: string,
    name: string,
    className: string | undefined,
) {
    if (args.length && validationIsActive()) {
        info(`Queue JSON schema generation for ${name} in ${srcFilePath}`);
        queueList.push({ args, srcFilePath, path, name, className });
        run();
    }
}

function run() {
    if (!process && queueList.length) {
        const { jsonSchemaFolder } = getOptions();
        const { name, srcFilePath, path, args, className } = queueList.pop();
        // console.log('args', args, name, srcFilePath);
        const typeName = className ? `${className}.${name}` : name;
        const command = `isomor-json-schema-generator --path ${srcFilePath} --type ${typeName}`;
        info(`Start JSON schema generation for ${name} in ${srcFilePath} (might take few seconds)`);
        // console.log('command', command);
        process = exec(command, async (err, stdout, stderr) => {
            if (err) {
                error(err);
            }
            if (stderr) {
                warn(stderr);
            }
            if (stdout && stdout.length) {
                // console.log(`stdout: ${stdout}`);
                const jsonSchemaFileName = getJsonSchemaFileName(path, name, className);
                const jsonFile = join(jsonSchemaFolder, jsonSchemaFileName);
                const data: ValidationSchema = {
                    args,
                    schema: JSON.parse(stdout),
                    name: typeName,
                };
                await outputJSON(jsonFile, data, { spaces: 4 });
                info(`JSON schema generation finished for ${name} in ${srcFilePath}`);
            } else {
                warn(`JSON schema generation empty for ${name} in ${srcFilePath}`);
            }
            process = null;
            run();
        });
    }
}
