"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AsExpressionNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/AsExpressionNodeParser");
const BasicAnnotationsReader_1 = require("ts-json-schema-generator/dist/src/AnnotationsReader/BasicAnnotationsReader");
const ExtendedAnnotationsReader_1 = require("ts-json-schema-generator/dist/src/AnnotationsReader/ExtendedAnnotationsReader");
const ChainNodeParser_1 = require("ts-json-schema-generator/dist/src/ChainNodeParser");
const CircularReferenceNodeParser_1 = require("ts-json-schema-generator/dist/src/CircularReferenceNodeParser");
const Config_1 = require("ts-json-schema-generator/dist/src/Config");
const ExposeNodeParser_1 = require("ts-json-schema-generator/dist/src/ExposeNodeParser");
const AnnotatedNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/AnnotatedNodeParser");
const AnyTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/AnyTypeNodeParser");
const ArrayNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/ArrayNodeParser");
const BooleanLiteralNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/BooleanLiteralNodeParser");
const BooleanTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/BooleanTypeNodeParser");
const CallExpressionParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/CallExpressionParser");
const ConditionalTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/ConditionalTypeNodeParser");
const EnumNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/EnumNodeParser");
const ExpressionWithTypeArgumentsNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/ExpressionWithTypeArgumentsNodeParser");
const HiddenTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/HiddenTypeNodeParser");
const IndexedAccessTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/IndexedAccessTypeNodeParser");
const InterfaceAndClassNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/InterfaceAndClassNodeParser");
const IntersectionNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/IntersectionNodeParser");
const LiteralNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/LiteralNodeParser");
const MappedTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/MappedTypeNodeParser");
const NeverTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/NeverTypeNodeParser");
const NullLiteralNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/NullLiteralNodeParser");
const NumberLiteralNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/NumberLiteralNodeParser");
const NumberTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/NumberTypeNodeParser");
const ObjectTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/ObjectTypeNodeParser");
const OptionalTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/OptionalTypeNodeParser");
const ParenthesizedNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/ParenthesizedNodeParser");
const PrefixUnaryExpressionNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/PrefixUnaryExpressionNodeParser");
const RestTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/RestTypeNodeParser");
const StringLiteralNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/StringLiteralNodeParser");
const StringTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/StringTypeNodeParser");
const TupleNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/TupleNodeParser");
const TypeAliasNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/TypeAliasNodeParser");
const TypeLiteralNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/TypeLiteralNodeParser");
const TypeofNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/TypeofNodeParser");
const TypeOperatorNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/TypeOperatorNodeParser");
const TypeReferenceNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/TypeReferenceNodeParser");
const UndefinedTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/UndefinedTypeNodeParser");
const UnionNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/UnionNodeParser");
const UnknownTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/UnknownTypeNodeParser");
const VoidTypeNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/VoidTypeNodeParser");
const TopRefNodeParser_1 = require("ts-json-schema-generator/dist/src/TopRefNodeParser");
const FunctionNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/FunctionNodeParser");
const ObjectLiteralExpressionNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/ObjectLiteralExpressionNodeParser");
const ArrayLiteralExpressionNodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser/ArrayLiteralExpressionNodeParser");
const FuncTypeNodeParser_1 = require("./NodeParser/FuncTypeNodeParser");
function createParser(program, config) {
    const typeChecker = program.getTypeChecker();
    const chainNodeParser = new ChainNodeParser_1.ChainNodeParser(typeChecker, []);
    const mergedConfig = Object.assign(Object.assign({}, Config_1.DEFAULT_CONFIG), config);
    function withExpose(nodeParser) {
        return new ExposeNodeParser_1.ExposeNodeParser(typeChecker, nodeParser, mergedConfig.expose);
    }
    function withTopRef(nodeParser) {
        return new TopRefNodeParser_1.TopRefNodeParser(chainNodeParser, mergedConfig.type, mergedConfig.topRef);
    }
    function withJsDoc(nodeParser) {
        const extraTags = new Set(mergedConfig.extraTags);
        if (mergedConfig.jsDoc === 'extended') {
            return new AnnotatedNodeParser_1.AnnotatedNodeParser(nodeParser, new ExtendedAnnotationsReader_1.ExtendedAnnotationsReader(typeChecker, extraTags));
        }
        else if (mergedConfig.jsDoc === 'basic') {
            return new AnnotatedNodeParser_1.AnnotatedNodeParser(nodeParser, new BasicAnnotationsReader_1.BasicAnnotationsReader(extraTags));
        }
        else {
            return nodeParser;
        }
    }
    function withCircular(nodeParser) {
        return new CircularReferenceNodeParser_1.CircularReferenceNodeParser(nodeParser);
    }
    chainNodeParser
        .addNodeParser(new FuncTypeNodeParser_1.FuncTypeNodeParser(chainNodeParser))
        .addNodeParser(new HiddenTypeNodeParser_1.HiddenNodeParser(typeChecker))
        .addNodeParser(new StringTypeNodeParser_1.StringTypeNodeParser())
        .addNodeParser(new NumberTypeNodeParser_1.NumberTypeNodeParser())
        .addNodeParser(new BooleanTypeNodeParser_1.BooleanTypeNodeParser())
        .addNodeParser(new AnyTypeNodeParser_1.AnyTypeNodeParser())
        .addNodeParser(new UnknownTypeNodeParser_1.UnknownTypeNodeParser())
        .addNodeParser(new VoidTypeNodeParser_1.VoidTypeNodeParser())
        .addNodeParser(new UndefinedTypeNodeParser_1.UndefinedTypeNodeParser())
        .addNodeParser(new NeverTypeNodeParser_1.NeverTypeNodeParser())
        .addNodeParser(new ObjectTypeNodeParser_1.ObjectTypeNodeParser())
        .addNodeParser(new AsExpressionNodeParser_1.AsExpressionNodeParser(chainNodeParser))
        .addNodeParser(new StringLiteralNodeParser_1.StringLiteralNodeParser())
        .addNodeParser(new NumberLiteralNodeParser_1.NumberLiteralNodeParser())
        .addNodeParser(new BooleanLiteralNodeParser_1.BooleanLiteralNodeParser())
        .addNodeParser(new NullLiteralNodeParser_1.NullLiteralNodeParser())
        .addNodeParser(new FunctionNodeParser_1.FunctionNodeParser())
        .addNodeParser(new ObjectLiteralExpressionNodeParser_1.ObjectLiteralExpressionNodeParser(chainNodeParser))
        .addNodeParser(new ArrayLiteralExpressionNodeParser_1.ArrayLiteralExpressionNodeParser(chainNodeParser))
        .addNodeParser(new PrefixUnaryExpressionNodeParser_1.PrefixUnaryExpressionNodeParser(chainNodeParser))
        .addNodeParser(new LiteralNodeParser_1.LiteralNodeParser(chainNodeParser))
        .addNodeParser(new ParenthesizedNodeParser_1.ParenthesizedNodeParser(chainNodeParser))
        .addNodeParser(new TypeReferenceNodeParser_1.TypeReferenceNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ExpressionWithTypeArgumentsNodeParser_1.ExpressionWithTypeArgumentsNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new IndexedAccessTypeNodeParser_1.IndexedAccessTypeNodeParser(chainNodeParser))
        .addNodeParser(new TypeofNodeParser_1.TypeofNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new MappedTypeNodeParser_1.MappedTypeNodeParser(chainNodeParser))
        .addNodeParser(new ConditionalTypeNodeParser_1.ConditionalTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeOperatorNodeParser_1.TypeOperatorNodeParser(chainNodeParser))
        .addNodeParser(new UnionNodeParser_1.UnionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new IntersectionNodeParser_1.IntersectionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TupleNodeParser_1.TupleNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new OptionalTypeNodeParser_1.OptionalTypeNodeParser(chainNodeParser))
        .addNodeParser(new RestTypeNodeParser_1.RestTypeNodeParser(chainNodeParser))
        .addNodeParser(new CallExpressionParser_1.CallExpressionParser(typeChecker, chainNodeParser))
        .addNodeParser(withCircular(withExpose(withJsDoc(new TypeAliasNodeParser_1.TypeAliasNodeParser(typeChecker, chainNodeParser)))))
        .addNodeParser(withExpose(withJsDoc(new EnumNodeParser_1.EnumNodeParser(typeChecker))))
        .addNodeParser(withCircular(withExpose(withJsDoc(new InterfaceAndClassNodeParser_1.InterfaceAndClassNodeParser(typeChecker, withJsDoc(chainNodeParser))))))
        .addNodeParser(withCircular(withExpose(withJsDoc(new TypeLiteralNodeParser_1.TypeLiteralNodeParser(withJsDoc(chainNodeParser))))))
        .addNodeParser(new ArrayNodeParser_1.ArrayNodeParser(chainNodeParser));
    return withTopRef(chainNodeParser);
}
exports.createParser = createParser;
//# sourceMappingURL=parser.js.map