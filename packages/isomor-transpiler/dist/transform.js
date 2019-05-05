"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const code_1 = require("./code");
const transformNode_1 = require("./transformNode");
const debug = debug_1.default('isomor-transpiler:transform');
function transform(body, path, withTypes = true, noServerImport = false) {
    body.forEach((node, index) => {
        const newNode = transformNode_1.transformNode(node, path, withTypes, noServerImport);
        if (newNode) {
            body[index] = newNode;
        }
        else {
            debug('remove code', node.type);
            delete body[index];
        }
    });
    body.unshift(code_1.getCodeImport());
    return body.filter(statement => statement);
}
exports.default = transform;
//# sourceMappingURL=transform.js.map