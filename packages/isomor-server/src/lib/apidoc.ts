import { Entrypoint } from '.';

export async function getApiDoc(
    endpoints: Entrypoint[],
) {
    const paths = {};
    let definitions = {};

    endpoints.forEach(({ file, path, validationSchema }) => {
        let $ref: string;
        let $schema: string;
        if (validationSchema && validationSchema.schema) {
            $ref =  validationSchema.schema.$ref;
            $schema =  validationSchema.schema.$schema;
            definitions = { ...definitions, ...validationSchema.schema.definitions };
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
}
