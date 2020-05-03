#!/usr/bin/env node

import { Config } from 'ts-json-schema-generator';
import { getOptions } from 'isomor-core';
import { join } from 'path';

import { createGenerator } from './generator';

if (process.argv.length < 3) {
    process.stdout.write('Please provide path to the ts file.\n');
} else {
    const config = {
        path: process.argv[2],
        tsconfig: join(getOptions().srcFolder, 'tsconfig.json'),
    } as Config;

    createGenerator(config).createSchema('default', process.argv[3]);
}
