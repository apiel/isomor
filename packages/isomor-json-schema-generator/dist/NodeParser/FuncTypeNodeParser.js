"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const ArrayType_1 = require("ts-json-schema-generator/dist/src/Type/ArrayType");
const OptionalType_1 = require("ts-json-schema-generator/dist/src/Type/OptionalType");
const RestType_1 = require("ts-json-schema-generator/dist/src/Type/RestType");
const TupleType_1 = require("ts-json-schema-generator/dist/src/Type/TupleType");
class FuncTypeNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.FunctionDeclaration
            || node.kind === ts.SyntaxKind.ArrowFunction
            || node.kind === ts.SyntaxKind.MethodDeclaration;
    }
    createType(node, context) {
        const types = node.parameters
            .map((item) => {
            const type = this.childNodeParser.createType(item.type, context);
            return item.dotDotDotToken
                ? new RestType_1.RestType(new ArrayType_1.ArrayType(type))
                : (item.questionToken ? new OptionalType_1.OptionalType(type) : type);
        });
        return new TupleType_1.TupleType(types);
    }
}
exports.FuncTypeNodeParser = FuncTypeNodeParser;
//# sourceMappingURL=FuncTypeNodeParser.js.map