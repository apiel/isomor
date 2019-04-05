const transformFileSync = require('@babel/core').transformFileSync;
const path = require('path');
const fs = require('fs');

const plugin = require('babel-plugin-macros');

const transformed = transformFileSync(path.join(__dirname, 'example.ts'), {
    presets: ["@babel/preset-typescript"],
    plugins: [[plugin]],
}).code;

console.log(transformed);
