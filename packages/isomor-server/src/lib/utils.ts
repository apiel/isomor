import { ValidationSchema } from 'isomor-core';
import * as Ajv from 'ajv';

export function validateArgs(
    validationSchema: ValidationSchema,
    args: any[],
) {
    if (validationSchema) {
        const ajv = new Ajv();
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        const valid = ajv.validate(validationSchema.schema, args);
        if (!valid) {
            throw (new Error(`Invalid argument format: ${ajv.errorsText()}.`));
        }
    }
}
