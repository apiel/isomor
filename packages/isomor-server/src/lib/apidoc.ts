import { Route } from '.';

export function getApiDoc(
    endpoints: Route[],
) {
    const paths = {};
    let definitions = {};

    endpoints.forEach(({ file, urlPath, validationSchema }) => {
        let $ref: string;
        let $schema: string;
        if (validationSchema && validationSchema.schema) {
            $ref = validationSchema.schema.$ref;
            $schema = validationSchema.schema.$schema;
            definitions = { ...definitions, ...validationSchema.schema.definitions };
        }
        paths[urlPath] = {
            post: { ...getEntrypointDoc(file, urlPath), ...getParametersDoc($ref, $schema) },
            get: getEntrypointDoc(file, urlPath),
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

const getParametersDoc = (
    $ref: string,
    $schema: string,
) => ({
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

const getEntrypointDoc = (
    file: string,
    urlPath: string,
) => ({
    operationId: `${file}-${urlPath}`,
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
