import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { getKey } from "../Utils/nodeKey";

export class MethodTypeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.MethodDeclaration): boolean {
        console.log('.', (node as any).name.escapedText, node.kind, node.kind === ts.SyntaxKind.MethodDeclaration);
        // console.log('.', node);
        return node.kind === ts.SyntaxKind.MethodDeclaration;
    }
    public createType(node: ts.FunctionDeclaration, context: Context): BaseType {
        console.log("'yo'", this.getParameters(node, context));
        return new ObjectType(
            this.getTypeId(node, context),
            [],
            this.getParameters(node, context),
            false,
        );
    }

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
