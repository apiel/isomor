import * as ts from "typescript";
import { Context, NodeParser } from "ts-json-schema-generator/dist/src/NodeParser";
import { SubNodeParser } from "ts-json-schema-generator/dist/src/SubNodeParser";
import { BaseType } from "ts-json-schema-generator/dist/src/Type/BaseType";
export declare class FuncTypeNodeParser implements SubNodeParser {
    private childNodeParser;
    constructor(childNodeParser: NodeParser);
    supportsNode(node: ts.FunctionDeclaration | ts.ArrowFunction | ts.MethodDeclaration): boolean;
    createType(node: ts.FunctionDeclaration, context: Context): BaseType;
}
