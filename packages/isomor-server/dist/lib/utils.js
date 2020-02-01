"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const Ajv = require("ajv");
function validateArgs(validationSchema, args) {
    if (validationSchema) {
        const ajv = new Ajv();
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        const valid = ajv.validate(validationSchema.schema, args);
        if (!valid) {
            throw (new Error(`Invalid argument format: ${ajv.errorsText()}.`));
        }
    }
}
exports.validateArgs = validateArgs;
function getFullPath(file) {
    try {
        return require.resolve(file, { paths: [process.cwd()] });
    }
    catch (error) {
        return require.resolve(path_1.join(process.cwd(), file));
    }
}
exports.getFullPath = getFullPath;
//# sourceMappingURL=utils.js.map