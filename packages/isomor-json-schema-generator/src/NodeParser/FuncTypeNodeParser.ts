import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { ArrayType } from "../Type/ArrayType";
import { BaseType } from "../Type/BaseType";
import { OptionalType } from "../Type/OptionalType";
import { RestType } from "../Type/RestType";
import { TupleType } from "../Type/TupleType";

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
