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
const path_1 = require("path");
const util_1 = require("util");
const fs_1 = require("fs");
let startupImport;
function getFunctions(distServerFolder, file) {
    const filepath = require.resolve(path_1.join(distServerFolder, file), { paths: [process.cwd()] });
    delete require.cache[filepath];
    const functions = require(filepath);
    return functions;
}
function getEntrypointPath(file, name, classname) {
    if (classname) {
        return `/isomor/${isomor_core_1.getPathForUrl(file)}/${classname}/${name}`;
    }
    return `/isomor/${isomor_core_1.getPathForUrl(file)}/${name}`;
}
function getEntrypoint(app, file, fn, name, classname) {
    const entrypoint = getEntrypointPath(file, name, classname);
    app.use(entrypoint, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const context = {
                req,
                res,
                fn,
            };
            const args = (req.body && req.body.args) || [];
            const result = yield context.fn(...args);
            return res.send(util_1.isNumber(result) ? result.toString() : result);
        }
        catch (error) {
            next(error);
        }
    }));
    return entrypoint;
}
function getClassEntrypoints(app, file, classname) {
    if (startupImport && startupImport.getInstance) {
        const obj = startupImport.getInstance(classname);
        return Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
            .filter(name => util_1.isFunction(obj[name]) && name !== 'constructor')
            .map(name => getEntrypoint(app, file, obj[name], name, classname));
    }
    return;
}
function useIsomor(app, distServerFolder, serverFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield isomor_core_1.getFiles(distServerFolder, serverFolder);
        return files.map(file => {
            const functions = getFunctions(distServerFolder, file);
            return Object.keys(functions)
                .filter(name => util_1.isFunction(functions[name]))
                .map(name => {
                const isClass = /^\s*class/.test(functions[name].toString());
                return isClass ? getClassEntrypoints(app, file, name)
                    : [getEntrypoint(app, file, functions[name], name)];
            }).flat();
        }).flat();
    });
}
exports.useIsomor = useIsomor;
function loadStartupImport(distServerFolder, serverFolder, startupFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = path_1.join(distServerFolder, serverFolder, startupFile);
        if (yield util_1.promisify(fs_1.exists)(path)) {
            const filepath = require.resolve(path, { paths: [process.cwd()] });
            startupImport = require(filepath);
        }
    });
}
exports.loadStartupImport = loadStartupImport;
function startup(app, distServerFolder, serverFolder, startupFile) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadStartupImport(distServerFolder, serverFolder, startupFile);
        if (startupImport && startupImport.default) {
            startupImport.default(app);
        }
    });
}
exports.startup = startup;
function getSwaggerDoc(distServerFolder, serverFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield isomor_core_1.getFiles(distServerFolder, serverFolder);
        const paths = {};
        return {
            swagger: '2.0',
            info: {
                title: 'isomor',
                version: 'API',
            },
            paths,
            definitions: {
                Args: {
                    type: 'object',
                    required: [
                        'args',
                    ],
                    properties: {
                        args: {
                            type: 'array',
                            example: [],
                        },
                    },
                },
            },
            consumes: [
                'application/json',
            ],
        };
    });
}
exports.getSwaggerDoc = getSwaggerDoc;
//# sourceMappingURL=index.js.map