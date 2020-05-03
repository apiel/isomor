import { Config } from 'ts-json-schema-generator';
import { SchemaGenerator } from './SchemaGenerator';
import { createFormatter } from 'ts-json-schema-generator/dist/factory/formatter';
import { createProgram } from 'ts-json-schema-generator/dist/factory/program';

import { createParser } from './parser';

export function createGenerator(config: Config): SchemaGenerator {
    const program = createProgram(config);
    const parser = createParser(program, config);
    const formatter = createFormatter(config);

    return new SchemaGenerator(program, parser, formatter);
}
