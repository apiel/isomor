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
function getApiDoc(endpoints) {
    return __awaiter(this, void 0, void 0, function* () {
        const paths = {};
        let definitions = {};
        endpoints.forEach(({ file, path, validationSchema }) => {
            let $ref;
            let $schema;
            if (validationSchema && validationSchema.schema) {
                $ref = validationSchema.schema.$ref;
                $schema = validationSchema.schema.$schema;
                definitions = Object.assign({}, definitions, validationSchema.schema.definitions);
            }
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
                                type: 'object',
                                required: [
                                    'args',
                                ],
                                properties: {
                                    args: $ref ? { $ref, $schema } : {
                                        type: 'array',
                                        example: [],
                                    },
                                },
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
            definitions,
            consumes: [
                'application/json',
            ],
        };
    });
}
exports.getApiDoc = getApiDoc;
//# sourceMappingURL=apidoc.js.map