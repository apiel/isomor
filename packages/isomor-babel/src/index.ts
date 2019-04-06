
import { Visitor, parseSync } from '@babel/core';
import { parse } from 'path';
import { getCodeFunc, getCodeArrowFunc, getCodeImport } from './code';

// const newNode = (parseSync('some code') as any).program.body[0];
// console.log('yoyoyo', JSON.stringify(newNode, null, 4));

export default function() {
    const withTypes = true; // should find out if it is js or ts

    const visitor: Visitor = {
        Program(path, { filename }: any) {
            const fileName = parse(filename).name;

            path.node.body.forEach((node, index) => {
                // if (isDeclaration(node, { type: 'ExportNamedDeclaration' })) { // doesnt work well with TS
                if (node.type === 'ExportNamedDeclaration') {
                    if (node.declaration.type === 'TSInterfaceDeclaration') {
                        // console.log('interface, keep it');
                    } else if (node.declaration.type === 'FunctionDeclaration') {
                        const { name } = node.declaration.id;
                        path.node.body[index] = getCodeFunc(fileName, name, withTypes);
                    } else if (node.declaration.type === 'VariableDeclaration') {
                        const { declarations } = node.declaration;
                        const declaration = declarations[0];
                        if (declaration.type === 'VariableDeclarator'
                            && declaration.init.type === 'ArrowFunctionExpression'
                            && declaration.id.type === 'Identifier'
                        ) {
                            const { name } = declaration.id;
                            path.node.body[index] = getCodeArrowFunc(fileName, name, withTypes);
                        } else {
                            // console.log('we should remove code', declaration);
                            delete path.node.body[index];
                        }
                    } else {
                        // console.log('we should remove code', node.declaration.type);
                        delete path.node.body[index];
                    }
                } else {
                    // console.log('we should remove code', node.type);
                    delete path.node.body[index];
                }
            });
            path.node.body.unshift(getCodeImport());
            // path.node.body = path.node.body.filter(statement => statement);
        },
    };

    return {
        name: 'isomor-babel',
        visitor,
    };
}
