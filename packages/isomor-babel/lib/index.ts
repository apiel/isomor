
import { Visitor } from '@babel/core';
import { parse } from 'path';
import transpiler from 'isomor-transpiler';

export default function() {
    const withTypes = true; // should find out if it is js or ts

    const visitor: Visitor = {
        Program(path, { filename }: any) {
            const fileName = parse(filename).name;
            path.node.body = transpiler(path.node.body as any, 'pathToFile?', 'package_name', null, fileName, withTypes) as any;
        },
    };

    return {
        name: 'isomor-babel',
        visitor,
    };
}
