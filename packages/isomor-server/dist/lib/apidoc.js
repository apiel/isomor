"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getApiDoc(endpoints) {
    const paths = {};
    let definitions = {};
    endpoints.forEach(({ file, path, validationSchema }) => {
        let $ref;
        let $schema;
        if (validationSchema && validationSchema.schema) {
            $ref = validationSchema.schema.$ref;
            $schema = validationSchema.schema.$schema;
            definitions = Object.assign(Object.assign({}, definitions), validationSchema.schema.definitions);
        }
        paths[path] = {
            post: Object.assign(Object.assign({}, getEntrypointDoc(file, path)), getParametersDoc($ref, $schema)),
            get: getEntrypointDoc(file, path),
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
}
exports.getApiDoc = getApiDoc;
const getParametersDoc = ($ref, $schema) => ({
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
});
const getEntrypointDoc = (file, path) => ({
    operationId: `${file}-${path}`,
    summary: file,
    tags: [file],
    produces: [
        'application/json',
    ],
    responses: {
        200: {
            description: '200 response',
            examples: {
                'application/json': '{}',
            },
        },
    },
});
//# sourceMappingURL=apidoc.js.map