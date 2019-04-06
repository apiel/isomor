https://astexplorer.net/



Look at https://www.npmjs.com/package/recast for alternative to babel-generator and typescript-eslint/typescript-estree.

might also be possible to use let program = ts.createProgram(fileNames, options); from typescript lib
https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#a-minimal-compiler


import * as ts from 'typescript';

    // const test = ts.createProgram({ rootNames: [fileName], options: {} });
    const test = ts.createSourceFile(
        fileName,
        content,
        ts.ScriptTarget.ES2015,
        /*setParentNodes */ true,
      );
    console.log('yoyoyoyoy', test.statements);

