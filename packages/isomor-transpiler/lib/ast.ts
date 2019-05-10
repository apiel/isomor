export { default as generate } from '@babel/generator';
export { ExportNamedDeclaration, Statement, ImportDeclaration } from '@babel/types';

import { parse as parseBabel } from '@babel/parser';

export function parse(code: string) {
    return parseBabel(code, {
        sourceType: 'module',
        plugins: [
            'typescript',
            // ['@babel/plugin-proposal-decorators', { legacy: true }],
            // "classProperties",
            // // TODO: This is enabled by default now, remove in Babel 8
            // "objectRestSpread",
        ],
    });
}

/*
* tools
*/

export function JsonAst(node: any) {
    const skip = ['loc', 'range'];
    const replacer = (key: string, value: any) => skip.includes(key) ? undefined : value;
    return JSON.stringify(node, replacer, 4);
}

/*
* Test
*/

if (process.env.TEST_AST) {
    const result = (node: any) => {
        console.log('node', JsonAst(node));
        console.log('node', node);
    };
    if (['interface', 'all'].includes(process.env.TEST_AST)) {
        const node = parse(`
            export interface MyInterface2 {
                hello: string;
                foo: CpuInfo;
            }
        `);
        result(node);
    } else if (['class', 'all'].includes(process.env.TEST_AST)) {
        const node = parse(`
            export class Post implements IsomorShare {
                @Length(10, 20)
                title: string;

                @Contains("hello")
                text: string;
            }
        `);
        result(node);
    }
}
