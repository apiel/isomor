const transformFileSync = require('@babel/core').transformFileSync;
const path = require('path');
const fs = require('fs');

const plugin = require('../dist/index');

const transformed = transformFileSync(path.join(__dirname, 'example.ts'), {
    presets: ["@babel/preset-typescript"],
    plugins: [[plugin]],
}).code;

console.log(transformed);
