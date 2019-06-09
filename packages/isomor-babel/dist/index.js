"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const isomor_transpiler_1 = require("isomor-transpiler");
function default_1() {
    const withTypes = true;
    const visitor = {
        Program(path, { filename }) {
            const fileName = path_1.parse(filename).name;
            path.node.body = isomor_transpiler_1.default(path.node.body, 'pathToFile?', 'package_name', fileName, withTypes);
        },
    };
    return {
        name: 'isomor-babel',
        visitor,
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map