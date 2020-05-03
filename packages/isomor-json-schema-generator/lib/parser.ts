import * as ts from 'typescript';

import { AsExpressionNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/AsExpressionNodeParser';
import { BasicAnnotationsReader } from 'ts-json-schema-generator/dist/src/AnnotationsReader/BasicAnnotationsReader';
import { ExtendedAnnotationsReader } from 'ts-json-schema-generator/dist/src/AnnotationsReader/ExtendedAnnotationsReader';
import { ChainNodeParser } from 'ts-json-schema-generator/dist/src/ChainNodeParser';
import { CircularReferenceNodeParser } from 'ts-json-schema-generator/dist/src/CircularReferenceNodeParser';
import {
    Config,
    DEFAULT_CONFIG,
} from 'ts-json-schema-generator/dist/src/Config';
import { ExposeNodeParser } from 'ts-json-schema-generator/dist/src/ExposeNodeParser';
import { NodeParser } from 'ts-json-schema-generator/dist/src/NodeParser';
import { AnnotatedNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/AnnotatedNodeParser';
import { AnyTypeNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/AnyTypeNodeParser';
import { ArrayNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/ArrayNodeParser';
import { BooleanLiteralNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/BooleanLiteralNodeParser';
import { BooleanTypeNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/BooleanTypeNodeParser';
import { CallExpressionParser } from 'ts-json-schema-generator/dist/src/NodeParser/CallExpressionParser';
import { ConditionalTypeNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/ConditionalTypeNodeParser';
import { EnumNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/EnumNodeParser';
import { ExpressionWithTypeArgumentsNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/ExpressionWithTypeArgumentsNodeParser';
import { HiddenNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/HiddenTypeNodeParser';
import { IndexedAccessTypeNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/IndexedAccessTypeNodeParser';
import { InterfaceAndClassNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/InterfaceAndClassNodeParser';
import { IntersectionNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/IntersectionNodeParser';
import { LiteralNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/LiteralNodeParser';
import { MappedTypeNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/MappedTypeNodeParser';
import { NeverTypeNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/NeverTypeNodeParser';
import { NullLiteralNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/NullLiteralNodeParser';
import { NumberLiteralNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/NumberLiteralNodeParser';
import { NumberTypeNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/NumberTypeNodeParser';
import { ObjectTypeNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/ObjectTypeNodeParser';
import { OptionalTypeNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/OptionalTypeNodeParser';
import { ParenthesizedNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/ParenthesizedNodeParser';
import { PrefixUnaryExpressionNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/PrefixUnaryExpressionNodeParser';
import { RestTypeNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/RestTypeNodeParser';
import { StringLiteralNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/StringLiteralNodeParser';
import { StringTypeNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/StringTypeNodeParser';
import { TupleNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/TupleNodeParser';
import { TypeAliasNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/TypeAliasNodeParser';
import { TypeLiteralNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/TypeLiteralNodeParser';
import { TypeofNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/TypeofNodeParser';
import { TypeOperatorNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/TypeOperatorNodeParser';
import { TypeReferenceNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/TypeReferenceNodeParser';
import { UndefinedTypeNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/UndefinedTypeNodeParser';
import { UnionNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/UnionNodeParser';
import { UnknownTypeNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/UnknownTypeNodeParser';
import { VoidTypeNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/VoidTypeNodeParser';
import { SubNodeParser } from 'ts-json-schema-generator/dist/src/SubNodeParser';
import { TopRefNodeParser } from 'ts-json-schema-generator/dist/src/TopRefNodeParser';
import { FunctionNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/FunctionNodeParser';
import { ObjectLiteralExpressionNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/ObjectLiteralExpressionNodeParser';
import { ArrayLiteralExpressionNodeParser } from 'ts-json-schema-generator/dist/src/NodeParser/ArrayLiteralExpressionNodeParser';

import { FuncTypeNodeParser } from './NodeParser/FuncTypeNodeParser';

export function createParser(program: ts.Program, config: Config): NodeParser {
    const typeChecker = program.getTypeChecker();
    const chainNodeParser = new ChainNodeParser(typeChecker, []);

    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    function withExpose(nodeParser: SubNodeParser): SubNodeParser {
        return new ExposeNodeParser(
            typeChecker,
            nodeParser,
            mergedConfig.expose,
        );
    }
    function withTopRef(nodeParser: NodeParser): NodeParser {
        return new TopRefNodeParser(
            chainNodeParser,
            mergedConfig.type,
            mergedConfig.topRef,
        );
    }
    function withJsDoc(nodeParser: SubNodeParser): SubNodeParser {
        const extraTags = new Set(mergedConfig.extraTags);
        if (mergedConfig.jsDoc === 'extended') {
            return new AnnotatedNodeParser(
                nodeParser,
                new ExtendedAnnotationsReader(typeChecker, extraTags),
            );
        } else if (mergedConfig.jsDoc === 'basic') {
            return new AnnotatedNodeParser(
                nodeParser,
                new BasicAnnotationsReader(extraTags),
            );
        } else {
            return nodeParser;
        }
    }
    function withCircular(nodeParser: SubNodeParser): SubNodeParser {
        return new CircularReferenceNodeParser(nodeParser);
    }

    chainNodeParser
        .addNodeParser(new FuncTypeNodeParser(chainNodeParser))

        .addNodeParser(new HiddenNodeParser(typeChecker))
        .addNodeParser(new StringTypeNodeParser())
        .addNodeParser(new NumberTypeNodeParser())
        .addNodeParser(new BooleanTypeNodeParser())
        .addNodeParser(new AnyTypeNodeParser())
        .addNodeParser(new UnknownTypeNodeParser())
        .addNodeParser(new VoidTypeNodeParser())
        .addNodeParser(new UndefinedTypeNodeParser())
        .addNodeParser(new NeverTypeNodeParser())
        .addNodeParser(new ObjectTypeNodeParser())
        .addNodeParser(new AsExpressionNodeParser(chainNodeParser))

        .addNodeParser(new StringLiteralNodeParser())
        .addNodeParser(new NumberLiteralNodeParser())
        .addNodeParser(new BooleanLiteralNodeParser())
        .addNodeParser(new NullLiteralNodeParser())
        .addNodeParser(new FunctionNodeParser())
        .addNodeParser(new ObjectLiteralExpressionNodeParser(chainNodeParser))
        .addNodeParser(new ArrayLiteralExpressionNodeParser(chainNodeParser))

        .addNodeParser(new PrefixUnaryExpressionNodeParser(chainNodeParser))

        .addNodeParser(new LiteralNodeParser(chainNodeParser))
        .addNodeParser(new ParenthesizedNodeParser(chainNodeParser))

        .addNodeParser(
            new TypeReferenceNodeParser(typeChecker, chainNodeParser),
        )
        .addNodeParser(
            new ExpressionWithTypeArgumentsNodeParser(
                typeChecker,
                chainNodeParser,
            ),
        )

        .addNodeParser(new IndexedAccessTypeNodeParser(chainNodeParser))
        .addNodeParser(new TypeofNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new MappedTypeNodeParser(chainNodeParser))
        .addNodeParser(
            new ConditionalTypeNodeParser(typeChecker, chainNodeParser),
        )
        .addNodeParser(new TypeOperatorNodeParser(chainNodeParser))

        .addNodeParser(new UnionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new IntersectionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TupleNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new OptionalTypeNodeParser(chainNodeParser))
        .addNodeParser(new RestTypeNodeParser(chainNodeParser))

        .addNodeParser(new CallExpressionParser(typeChecker, chainNodeParser))

        .addNodeParser(
            withCircular(
                withExpose(
                    withJsDoc(
                        new TypeAliasNodeParser(typeChecker, chainNodeParser),
                    ),
                ),
            ),
        )
        .addNodeParser(withExpose(withJsDoc(new EnumNodeParser(typeChecker))))
        .addNodeParser(
            withCircular(
                withExpose(
                    withJsDoc(
                        new InterfaceAndClassNodeParser(
                            typeChecker,
                            withJsDoc(chainNodeParser),
                        ),
                    ),
                ),
            ),
        )
        .addNodeParser(
            withCircular(
                withExpose(
                    withJsDoc(
                        new TypeLiteralNodeParser(withJsDoc(chainNodeParser)),
                    ),
                ),
            ),
        )

        .addNodeParser(new ArrayNodeParser(chainNodeParser));

    return withTopRef(chainNodeParser);
}
