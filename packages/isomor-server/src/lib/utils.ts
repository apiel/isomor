import { join } from 'path';
import * as Ajv from 'ajv';

export function validateArgs(
    validationSchema: any,
    args: any[],
) {
    if (validationSchema) {
        const ajv = new Ajv();
        // ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-07.json'));
        const valid = ajv.validate(validationSchema, args);
        if (!valid) {
            throw (new Error(`Invalid argument format: ${ajv.errorsText()}.`));
        }
    }
}

export function getFullPath(file: string) {
    try {
        return require.resolve(file, { paths: [process.cwd()] });
    } catch (error) {
        return require.resolve(
            join(process.cwd(), file),
        );
    }
}