#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("./generator");
if (process.argv.length < 3) {
    process.stdout.write('Please provide path to the ts file.\n');
}
else {
    const config = {
        path: process.argv[2],
    };
    generator_1.createGenerator(config).createSchema('default', process.argv[3]);
}
//# sourceMappingURL=index.js.map