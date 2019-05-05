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
function getFunctions(distServerFolder, file) {
    const filepath = require.resolve(path_1.join(distServerFolder, file), { paths: [process.cwd()] });
    delete require.cache[filepath];
    const functions = require(filepath);
    return functions;
}
function getEntrypoint(file, name) {
    return `/isomor/${isomor_core_1.getPathForUrl(file)}/${name}`;
}
function useIsomor(app, distServerFolder, serverFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield isomor_core_1.getFiles(distServerFolder, serverFolder);
        return files.map(file => {
            const functions = getFunctions(distServerFolder, file);
            return Object.keys(functions).map(name => {
                const entrypoint = getEntrypoint(file, name);
                app.use(entrypoint, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const context = {
                            req,
                            res,
                            fn: functions[name],
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
            });
        }).flat();
    });
}
exports.useIsomor = useIsomor;
function getSwaggerDoc(distServerFolder, serverFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield isomor_core_1.getFiles(distServerFolder, serverFolder);
        const paths = {};
        files.forEach(file => {
            const functions = getFunctions(distServerFolder, file);
            return Object.keys(functions).forEach(name => {
                paths[getEntrypoint(file, name)] = {
                    post: {
                        operationId: `${file}-${name}`,
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