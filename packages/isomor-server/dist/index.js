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
const fs_1 = require("fs");
let startupImport;
const urlPrefix = '/isomor';
function getUrl(path, funcName, classname) {
    const url = classname
        ? `${urlPrefix}/${path}/${classname}/${funcName}`
        : `${urlPrefix}/${path}/${funcName}`;
    return url;
}
exports.getUrl = getUrl;
function getEntrypointPath(file, name, classname) {
    return getUrl(isomor_core_1.getPathForUrl(file), name, classname);
}
function getFunctions(distServerFolder, file) {
    const filepath = require.resolve(path_1.join(distServerFolder, file), { paths: [process.cwd()] });
    delete require.cache[filepath];
    const functions = require(filepath);
    return functions;
}
function getEntrypoint(app, file, fn, name, classname) {
    const path = getEntrypointPath(file, name, classname);
    app.use(path, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    return { path, file };
}
function getClassEntrypoints(app, file, classname, noDecorator) {
    if (startupImport && startupImport.getInstance) {
        if (!noDecorator && !isomor_1.isIsomorClass(classname)) {
            return [];
        }
        const obj = startupImport.getInstance(classname);
        return Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
            .filter(name => util_1.isFunction(obj[name]) && name !== 'constructor')
            .map(name => getEntrypoint(app, file, obj[name], name, classname));
    }
    return [];
}
function useIsomor(app, distServerFolder, serverFolder, noDecorator = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield isomor_core_1.getFiles(distServerFolder, serverFolder);
        return files.map(file => {
            const functions = getFunctions(distServerFolder, file);
            return Object.keys(functions)
                .filter(name => util_1.isFunction(functions[name]))
                .map(name => {
                const isClass = /^\s*class/.test(functions[name].toString());
                return isClass ? getClassEntrypoints(app, file, name, noDecorator)
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
function getSwaggerDoc(endpoints) {
    return __awaiter(this, void 0, void 0, function* () {
        const paths = {};
        endpoints.forEach(({ file, path }) => {
            paths[path] = {
                post: {
                    operationId: `${file}-${path}`,
                    summary: file,
                    tags: [file],
                    produces: [
                        'application/json',
                    ],
                    parameters: [
                        {
                            name: 'args',
                            in: 'body',
                            description: 'Function arguments',
                            required: true,
                            schema: {
                                $ref: '#/definitions/Args',
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: '200 response',
                            examples: {
                                'application/json': '{}',
                            },
                        },
                    },
                },
            };
        });
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