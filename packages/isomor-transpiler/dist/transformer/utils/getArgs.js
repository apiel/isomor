"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logol_1 = require("logol");
const validation_1 = require("../../validation");
function getArgs(paramRoot, srcFilePath, path, name, className) {
    const params = paramRoot.params.filter(({ type }) => type === 'Identifier');
    let args = params.map((param) => param.name);
    if (params.length !== paramRoot.params.length) {
        logol_1.warn('TransformFunc support only Identifier as params');
        args = [];
    }
    else {
        validation_1.pushToQueue(args, srcFilePath, path, name, className);
    }
    return args;
}
exports.getArgs = getArgs;
//# sourceMappingURL=getArgs.js.map