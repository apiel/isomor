import * as ts from 'typescript';
import { writeFileSync } from 'fs';
import { NoRootTypeError } from 'ts-json-schema-generator/dist/src/Error/NoRootTypeError';
import {
    Context,
    NodeParser,
} from 'ts-json-schema-generator/dist/src/NodeParser';
import { Definition } from 'ts-json-schema-generator/dist/src/Schema/Definition';
import { Schema } from 'ts-json-schema-generator/dist/src/Schema/Schema';
import { BaseType } from 'ts-json-schema-generator/dist/src/Type/BaseType';
import { DefinitionType } from 'ts-json-schema-generator/dist/src/Type/DefinitionType';
import { TypeFormatter } from 'ts-json-schema-generator/dist/src/TypeFormatter';
import { StringMap } from 'ts-json-schema-generator/dist/src/Utils/StringMap';
import {
    localSymbolAtNode,
    symbolAtNode,
} from 'ts-json-schema-generator/dist/src/Utils/symbolAtNode';
import { removeUnreachable } from 'ts-json-schema-generator/dist/src/Utils/removeUnreachable';

export class SchemaGenerator {
    public constructor(
        private readonly program: ts.Program,
        private readonly nodeParser: NodeParser,
        private readonly typeFormatter: TypeFormatter,
    ) {}

    public createSchema(fullName: string, destination?: string): Schema {
        const { node, rootSourceFile } = this.getRootNode(fullName);
        const schema = this.createSchemaFromNodes(node);

        const file = destination || `${rootSourceFile.fileName}.json`;
        writeFileSync(file, JSON.stringify(schema, null, 4));

        return schema;
    }

    private createSchemaFromNodes(rootNode: ts.Node): Schema {
        const rootType = this.nodeParser.createType(rootNode, new Context());
        const rootTypeDefinition = this.getRootTypeDefinition(rootType);
        const definitions: StringMap<Definition> = {};
        this.appendRootChildDefinitions(rootType, definitions);

        const reachableDefinitions = removeUnreachable(
            rootTypeDefinition,
            definitions,
        );

        return {
            $schema: 'http://json-schema.org/draft-07/schema#',
            ...(rootTypeDefinition ?? {}),
            definitions: reachableDefinitions,
        };
    }

    private getRootNode(fullName: string) {
        const rootFileNames = this.program.getRootFileNames();
        const rootSourceFiles = this.program
            .getSourceFiles()
            .filter((sourceFile) =>
                rootFileNames.includes(sourceFile.fileName),
            );
        // For the moment handle only single file
        const rootSourceFile = rootSourceFiles[0];
        const exports = symbolAtNode(rootSourceFile)?.exports;
        if (exports) {
            const symbol = exports.get(fullName as ts.__String);
            if (symbol) {
                const node = symbol.declarations[0];
                if (
                    // node.kind === ts.SyntaxKind.InterfaceDeclaration ||
                    // node.kind === ts.SyntaxKind.EnumDeclaration ||
                    // node.kind === ts.SyntaxKind.TypeAliasDeclaration ||
                    // node.kind === ts.SyntaxKind.MethodDeclaration ||
                    node.kind === ts.SyntaxKind.FunctionDeclaration ||
                    node.kind === ts.SyntaxKind.ArrowFunction
                ) {
                    return { node, rootSourceFile };
                }
            }
        }
        throw new NoRootTypeError(fullName);
    }

    private getRootTypeDefinition(rootType: BaseType): Definition {
        return this.typeFormatter.getDefinition(rootType);
    }
    private appendRootChildDefinitions(
        rootType: BaseType,
        childDefinitions: StringMap<Definition>,
    ): void {
        const seen = new Set<string>();

        const children = this.typeFormatter
            .getChildren(rootType)
            .filter(
                (child): child is DefinitionType =>
                    child instanceof DefinitionType,
            )
            .filter((child) => {
                if (!seen.has(child.getId())) {
                    seen.add(child.getId());
                    return true;
                }
                return false;
            });

        const ids = new Map<string, string>();
        for (const child of children) {
            const name = child.getName();
            const previousId = ids.get(name);
            if (previousId && child.getId() !== previousId) {
                throw new Error(`Type "${name}" has multiple definitions.`);
            }
            ids.set(name, child.getId());
        }

        children.reduce((definitions, child) => {
            const name = child.getName();
            if (!(name in definitions)) {
                definitions[name] = this.typeFormatter.getDefinition(
                    child.getType(),
                );
            }
            return definitions;
        }, childDefinitions);
    }
    private partitionFiles() {
        const projectFiles = new Array<ts.SourceFile>();
        const externalFiles = new Array<ts.SourceFile>();

        for (const sourceFile of this.program.getSourceFiles()) {
            const destination = sourceFile.fileName.includes('/node_modules/')
                ? externalFiles
                : projectFiles;
            destination.push(sourceFile);
        }

        return { projectFiles, externalFiles };
    }
    private appendTypes(
        sourceFiles: readonly ts.SourceFile[],
        typeChecker: ts.TypeChecker,
        types: Map<string, ts.Node>,
    ) {
        for (const sourceFile of sourceFiles) {
            this.inspectNode(sourceFile, typeChecker, types);
        }
    }
    private inspectNode(
        node: ts.Node,
        typeChecker: ts.TypeChecker,
        allTypes: Map<string, ts.Node>,
    ): void {
        switch (node.kind) {
            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.EnumDeclaration:
            case ts.SyntaxKind.TypeAliasDeclaration:
                if (
                    !this.isExportType(node) ||
                    this.isGenericType(node as ts.TypeAliasDeclaration)
                ) {
                    return;
                }

                allTypes.set(this.getFullName(node, typeChecker), node);
                break;
            default:
                ts.forEachChild(node, (subnode) =>
                    this.inspectNode(subnode, typeChecker, allTypes),
                );
                break;
        }
    }
    private isExportType(node: ts.Node): boolean {
        const localSymbol = localSymbolAtNode(node);
        return localSymbol ? 'exportSymbol' in localSymbol : false;
    }
    private isGenericType(node: ts.TypeAliasDeclaration): boolean {
        return !!(node.typeParameters && node.typeParameters.length > 0);
    }
    private getFullName(node: ts.Node, typeChecker: ts.TypeChecker): string {
        const symbol = symbolAtNode(node)!;
        return typeChecker.getFullyQualifiedName(symbol).replace(/".*"\./, '');
    }
}
