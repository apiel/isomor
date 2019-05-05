"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const code_1 = require("./code");
const transformNode_1 = require("./transformNode");
const util_1 = require("util");
const debug = debug_1.default('isomor-transpiler:transform');
function transform(body, path, withTypes = true, noServerImport = false) {
    let newBody = [code_1.getCodeImport()];
    body.forEach((node) => {
        const newNode = transformNode_1.transformNode(node, path, withTypes, noServerImport);
        if (newNode) {
            if (util_1.isArray(newNode)) {
                newBody = [...newBody, ...newNode];
            }
            else {
                newBody = [...newBody, newNode];
            }
        }
        else {
            debug('remove code', node.type);
        }
    });
    return newBody;
}
exports.default = transform;
//# sourceMappingURL=transform.js.map