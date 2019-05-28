export { default as generate } from '@babel/generator';
export {
    ExportNamedDeclaration,
    Statement,
    ImportDeclaration,
    FunctionDeclaration,
    VariableDeclaration,
} from '@babel/types';

import { parse as parseBabel } from '@babel/parser';

export function parse(code: string) {
    return parseBabel(code, {
        sourceType: 'module',
        plugins: [
            'typescript',
            'decorators-legacy',
            // ['decorators', { decoratorsBeforeExport: true }],
            // ['@babel/plugin-proposal-decorators', { legacy: true }] as any,
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
    const skip = ['loc', 'range', 'start', 'end'];
    const replacer = (key: string, value: any) => skip.includes(key) ? undefined : value;
    return JSON.stringify(node, replacer, 4);
}

/*
* Test
*/

if (process.env.TEST_AST) {
    const result = (node: any) => {
        console.log('node', JsonAst(node)); // tslint:disable-line
        console.log('node', node); // tslint:disable-line
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
    } else if (['argsObject', 'all'].includes(process.env.TEST_AST)) {
        const node = parse(`
            const [input1, input2] = args;
            const argsObject = { input1, input2 };
        `);
        result(node);
    }
}
