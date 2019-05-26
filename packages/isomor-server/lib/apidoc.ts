import { Entrypoint } from '.';

export async function getApiDoc(
    endpoints: Entrypoint[],
) {
    const paths = {};

    // need to fix swagger

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
}
