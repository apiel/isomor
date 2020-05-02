import * as ts from 'typescript';
import { join } from 'path';
import { NoRootTypeError } from './Error/NoRootTypeError';
import { Context, NodeParser } from './NodeParser';
import { Definition } from './Schema/Definition';
import { Schema } from './Schema/Schema';
import { BaseType } from './Type/BaseType';
import { DefinitionType } from './Type/DefinitionType';
import { TypeFormatter } from './TypeFormatter';
import { StringMap } from './Utils/StringMap';
import { symbolAtNode } from './Utils/symbolAtNode';
import { Config } from './Config';

export class SchemaGenerator {
    private sourceFile: ts.SourceFile;

    public constructor(
        private program: ts.Program,
        private nodeParser: NodeParser,
        private typeFormatter: TypeFormatter,
        config: Config,
    ) {
        const searchForFile = require.resolve(join(process.cwd(), config.path));
        const sourceFiles = this.program.getSourceFiles();
        for (const f of sourceFiles) {
            if (f.fileName === searchForFile) {
                this.sourceFile = f;
            }
        }
        if (!this.sourceFile) {
            throw new Error(`Couldn't find source file: ${searchForFile}`);
        }
    }

    public createSchema(fullName: string): Schema {
        const rootNode = this.findRootNode(fullName);
        const rootType = this.nodeParser.createType(rootNode, new Context());

        return {
            $schema: 'http://json-schema.org/draft-06/schema#',
            definitions: this.getRootChildDefinitions(rootType),
            ...this.getRootTypeDefinition(rootType),
        };
    }

    private findRootNode(fullName: string): ts.Node {
        const exports = symbolAtNode(this.sourceFile)?.exports;
        if (exports) {
            const symbol = exports.get(fullName as ts.__String);
            if (symbol) {
                const node = symbol.declarations[0];
                if (
                    node.kind === ts.SyntaxKind.InterfaceDeclaration ||
                    node.kind === ts.SyntaxKind.EnumDeclaration ||
                    node.kind === ts.SyntaxKind.TypeAliasDeclaration ||
                    node.kind === ts.SyntaxKind.FunctionDeclaration ||
                    node.kind === ts.SyntaxKind.ArrowFunction ||
                    node.kind === ts.SyntaxKind.MethodDeclaration
                ) {
                    return node;
                }
            }
        }
        throw new NoRootTypeError(fullName);
    }

    private getRootTypeDefinition(rootType: BaseType): Definition {
        return this.typeFormatter.getDefinition(rootType);
    }
    private getRootChildDefinitions(rootType: BaseType): StringMap<Definition> {
        const seen = new Set<string>();

        const children = this.typeFormatter
            .getChildren(rootType)
            .filter((child) => child instanceof DefinitionType)
            .filter((child: DefinitionType) => {
                if (!seen.has(child.getId())) {
                    seen.add(child.getId());
                    return true;
                }
                return false;
            }) as DefinitionType[];

        return children.reduce((result: StringMap<Definition>, child) => {
            const name = child.getName();
            if (name in result) {
                throw new Error(`Type "${name}" has multiple definitions.`);
            }
            return {
                ...result,
                [name]: this.typeFormatter.getDefinition(child.getType()),
            };
        }, {});
    }
}
