import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { getKey } from "../Utils/nodeKey";
import { TupleType } from "../Type/TupleType";
import { referenceHidden } from "../Utils/isHidden";
import { OptionalType } from "../Type/OptionalType";

export class FuncTypeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
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
                            const type = this.childNodeParser.createType(item.type as any, context);
                            return item.questionToken ? new OptionalType(type) : type;
                        });
        // console.log("types", types);
        return new TupleType(types);
    }

    // public createType(node: ts.FunctionDeclaration, context: Context): BaseType {
    //     return new ObjectType(
    //         this.getTypeId(node, context),
    //         [],
    //         this.getParameters(node, context),
    //         false,
    //     );
    // }

    private getParameters(node: ts.FunctionDeclaration | ts.ArrowFunction, context: Context): ObjectProperty[] {
        return node.parameters.map(paramNode => {
            return new ObjectProperty(
                paramNode.name.getText(),
                this.childNodeParser.createType(paramNode.type!, context),
                !paramNode.questionToken,
            );
        });
    }

    private getTypeId(node: ts.Node, context: Context): string {
        return `function-${getKey(node, context)}`;
    }
}
