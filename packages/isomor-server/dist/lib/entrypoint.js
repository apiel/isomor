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
const isomor_core_1 = require("isomor-core");
const isomor_1 = require("isomor");
const path_1 = require("path");
const util_1 = require("util");
const fs_extra_1 = require("fs-extra");
const Ajv = require("ajv");
const startup_1 = require("./startup");
function getEntrypointPath(file, name, classname) {
    return isomor_1.getUrl(isomor_core_1.getPathForUrl(file), name, classname);
}
function loadValidation(path, name, jsonSchemaFolder, classname) {
    if (jsonSchemaFolder && jsonSchemaFolder.length) {
        const jsonSchemaFile = isomor_core_1.getJsonSchemaFileName(path, name, classname);
        const jsonSchemaPath = path_1.join(jsonSchemaFolder, jsonSchemaFile);
        if (fs_extra_1.pathExistsSync(jsonSchemaPath)) {
            return fs_extra_1.readJSONSync(jsonSchemaPath);
        }
    }
}
function validateArgs(validationSchema, args) {
    if (validationSchema) {
        if (args.length > validationSchema.args.length) {
            throw (new Error(`Too much arguments provided. Expected: ${validationSchema.args.join(', ')}.`));
        }
        const argsObject = {};
        args.forEach((value, index) => argsObject[validationSchema.args[index]] = value);
        const ajv = new Ajv();
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        const valid = ajv.validate(validationSchema.schema, argsObject);
        if (!valid) {
            throw (new Error(`Invalid argument format: ${ajv.errorsText()}.`));
        }
    }
}
function getEntrypoint(app, file, fn, name, jsonSchemaFolder, classname) {
    const path = getEntrypointPath(file, name, classname);
    const validationSchema = loadValidation(isomor_core_1.getPathForUrl(file), name, jsonSchemaFolder, classname);
    app.use(path, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const ctx = { req, res };
            const args = (req.body && req.body.args) || [];
            validateArgs(validationSchema, args);
            const result = yield fn.call(ctx, ...args, req, res);
            return res.send({ result });
        }
        catch (error) {
            next(error);
        }
    }));
    return { path, file };
}
exports.getEntrypoint = getEntrypoint;
function getClassEntrypoints(app, file, classname, jsonSchemaFolder, noDecorator) {
    if (!noDecorator && !isomor_1.isIsomorClass(classname)) {
        return [];
    }
    else if (startup_1.getInstance()) {
        const obj = startup_1.getInstance()(classname);
        return Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
            .filter(name => util_1.isFunction(obj[name]) && name !== 'constructor')
            .map(name => getEntrypoint(app, file, obj[name].bind(obj), name, jsonSchemaFolder, classname));
    }
    return [];
}
exports.getClassEntrypoints = getClassEntrypoints;
function getFunctions(distServerFolder, file) {
    const filepath = require.resolve(path_1.join(distServerFolder, file), { paths: [process.cwd()] });
    delete require.cache[filepath];
    const functions = require(filepath);
    return functions;
}
exports.getFunctions = getFunctions;
//# sourceMappingURL=entrypoint.js.map