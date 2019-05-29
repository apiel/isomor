"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logol_1 = require("logol");
const validation_1 = require("../../validation");
function getArgs(paramRoot, srcFilePath, path, name, className) {
    let args = paramRoot.params.map((param) => {
        if (param.type === 'Identifier') {
            return param.name;
        }
        else if (param.type === 'AssignmentPattern' && param.left.type === 'Identifier') {
            return param.left.name;
        }
    }).filter(param => param);
    if (args.length !== paramRoot.params.length) {
        logol_1.warn('TransformFunc support only Identifier as params', srcFilePath, name);
        args = [];
    }
    else {
        validation_1.pushToQueue(args, srcFilePath, path, name, className);
    }
    return args;
}
exports.getArgs = getArgs;
//# sourceMappingURL=getArgs.js.map