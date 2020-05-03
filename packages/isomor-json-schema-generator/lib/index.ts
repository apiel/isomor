#!/usr/bin/env node

import { Config } from 'ts-json-schema-generator';
import { createGenerator } from './generator';

// console.log('process.argv', process.argv);

const config = {
    path: '../example/react-typeorm/api/getList.ts',
} as Config;

const schema = createGenerator(config).createSchema('default');
console.log('schema', schema);
