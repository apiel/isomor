import * as ts from 'typescript';
import { Config } from 'ts-json-schema-generator/dist/src/Config';
import { NodeParser } from 'ts-json-schema-generator/dist/src/NodeParser';
export declare function createParser(program: ts.Program, config: Config): NodeParser;
