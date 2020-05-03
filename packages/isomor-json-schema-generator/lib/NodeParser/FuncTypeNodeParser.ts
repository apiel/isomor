import * as ts from "typescript";
import { Context, NodeParser } from "ts-json-schema-generator/dist/src/NodeParser";
import { SubNodeParser } from "ts-json-schema-generator/dist/src/SubNodeParser";
import { ArrayType } from "ts-json-schema-generator/dist/src/Type/ArrayType";
import { BaseType } from "ts-json-schema-generator/dist/src/Type/BaseType";
import { OptionalType } from "ts-json-schema-generator/dist/src/Type/OptionalType";
import { RestType } from "ts-json-schema-generator/dist/src/Type/RestType";
import { TupleType } from "ts-json-schema-generator/dist/src/Type/TupleType";

export class FuncTypeNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.FunctionDeclaration | ts.ArrowFunction | ts.MethodDeclaration): boolean {
        return node.kind === ts.SyntaxKind.FunctionDeclaration
            || node.kind === ts.SyntaxKind.ArrowFunction
            || node.kind === ts.SyntaxKind.MethodDeclaration;
    }

    public createType(node: ts.FunctionDeclaration, context: Context): BaseType {
        const types = node.parameters
                        .map((item) => {
                            // console.log("item", item);
                            // what if item.type does not exist?
                            const type = this.childNodeParser.createType(item.type!, context);
                            return item.dotDotDotToken
                                ? new RestType(new ArrayType(type))
                                : (item.questionToken ? new OptionalType(type) : type);
                        });
        // console.log("types", types);
        return new TupleType(types);
    }
}
