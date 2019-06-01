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
    let args = paramRoot.params.map((param) => {
        if (param.type === 'Identifier') {
            return param.name;
        } else if (param.type === 'AssignmentPattern' && param.left.type === 'Identifier') {
            return param.left.name;
        }
    }).filter(param => param);
    if (args.length !== paramRoot.params.length) {
        // need to work on that to support as well ...
        warn('TransformFunc support only Identifier as params', srcFilePath, name);
        // console.log('paramRoot', JsonAst(paramRoot));
        args = [];
    } else {
        pushToQueue(args, srcFilePath, path, name, className);
    }
    return args;
}

function validationIsActive() {
    const { jsonSchemaFolder, validation } = getOptions();
    return validation && jsonSchemaFolder && jsonSchemaFolder.length;
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
        const command = className
            ? `isomor-json-schema-generator --path ${srcFilePath} --type ${className}.${name}`
            : `isomor-json-schema-generator --path ${srcFilePath} --type ${name}`;
        info(`Start JSON schema generation for ${name} in ${srcFilePath} (might take few seconds)`);
        process = exec(command, async (err, stdout, stderr) => {
            if (err) {
                error(err);
            }
            if (stderr) {
                warn(stderr);
            }
            // console.log(`stdout: ${stdout}`);
            const jsonSchemaFileName = getJsonSchemaFileName(path, name, className);
            const jsonFile = join(jsonSchemaFolder, jsonSchemaFileName);
            const data: ValidationSchema = {
                args,
                schema: JSON.parse(stdout),
            };
            await outputJSON(jsonFile, data, { spaces: 4 });
            info(`JSON schema generation finished for ${name} in ${srcFilePath}`);
            process = null;
            run();
        });
    }
}
