import { parse } from '@babel/parser';
import { transformSync } from '@babel/core';

// import '@babel/preset-env';
// import '@babel/preset-typescript';

const config = {
    sourceType: 'script' as any, // 'module',
    presets: [
        '@babel/env',
        // '@babel/typescript',
        // '@babel/preset-env',
        '@babel/preset-typescript',
    ],
    plugins: [
        [ '@babel/plugin-proposal-decorators', { legacy: true } ],
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
        // 'exportDefaultFrom',
    ],
    cwd: process.cwd(),
    filename: 'file.ts',
    filenameRelative: 'file.ts',
    sourceFileName: 'file.ts',
    babelrc: false,
    ast: true,
};

export default function(code: string) {
    const { ast } = transformSync(code, config);
    return ast;
}
