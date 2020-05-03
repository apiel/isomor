"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const fs_1 = require("fs");
const NoRootTypeError_1 = require("ts-json-schema-generator/dist/src/Error/NoRootTypeError");
const NodeParser_1 = require("ts-json-schema-generator/dist/src/NodeParser");
const DefinitionType_1 = require("ts-json-schema-generator/dist/src/Type/DefinitionType");
const symbolAtNode_1 = require("ts-json-schema-generator/dist/src/Utils/symbolAtNode");
const removeUnreachable_1 = require("ts-json-schema-generator/dist/src/Utils/removeUnreachable");
class SchemaGenerator {
    constructor(program, nodeParser, typeFormatter) {
        this.program = program;
        this.nodeParser = nodeParser;
        this.typeFormatter = typeFormatter;
    }
    createSchema(fullName, destination) {
        const { node, rootSourceFile } = this.getRootNode(fullName);
        const schema = this.createSchemaFromNodes(node);
        const file = destination || `${rootSourceFile.fileName}.json`;
        fs_1.writeFileSync(file, JSON.stringify(schema, null, 4));
        return schema;
    }
    createSchemaFromNodes(rootNode) {
        const rootType = this.nodeParser.createType(rootNode, new NodeParser_1.Context());
        const rootTypeDefinition = this.getRootTypeDefinition(rootType);
        const definitions = {};
        this.appendRootChildDefinitions(rootType, definitions);
        const reachableDefinitions = removeUnreachable_1.removeUnreachable(rootTypeDefinition, definitions);
        return Object.assign(Object.assign({ $schema: 'http://json-schema.org/draft-07/schema#' }, (rootTypeDefinition !== null && rootTypeDefinition !== void 0 ? rootTypeDefinition : {})), { definitions: reachableDefinitions });
    }
    getRootNode(fullName) {
        var _a;
        const rootFileNames = this.program.getRootFileNames();
        const rootSourceFiles = this.program
            .getSourceFiles()
            .filter((sourceFile) => rootFileNames.includes(sourceFile.fileName));
        const rootSourceFile = rootSourceFiles[0];
        const exports = (_a = symbolAtNode_1.symbolAtNode(rootSourceFile)) === null || _a === void 0 ? void 0 : _a.exports;
        if (exports) {
            const symbol = exports.get(fullName);
            if (symbol) {
                const node = symbol.declarations[0];
                if (node.kind === ts.SyntaxKind.FunctionDeclaration ||
                    node.kind === ts.SyntaxKind.ArrowFunction) {
                    return { node, rootSourceFile };
                }
            }
        }
        throw new NoRootTypeError_1.NoRootTypeError(fullName);
    }
    getRootTypeDefinition(rootType) {
        return this.typeFormatter.getDefinition(rootType);
    }
    appendRootChildDefinitions(rootType, childDefinitions) {
        const seen = new Set();
        const children = this.typeFormatter
            .getChildren(rootType)
            .filter((child) => child instanceof DefinitionType_1.DefinitionType)
            .filter((child) => {
            if (!seen.has(child.getId())) {
                seen.add(child.getId());
                return true;
            }
            return false;
        });
        const ids = new Map();
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
                definitions[name] = this.typeFormatter.getDefinition(child.getType());
            }
            return definitions;
        }, childDefinitions);
    }
    partitionFiles() {
        const projectFiles = new Array();
        const externalFiles = new Array();
        for (const sourceFile of this.program.getSourceFiles()) {
            const destination = sourceFile.fileName.includes('/node_modules/')
                ? externalFiles
                : projectFiles;
            destination.push(sourceFile);
        }
        return { projectFiles, externalFiles };
    }
    appendTypes(sourceFiles, typeChecker, types) {
        for (const sourceFile of sourceFiles) {
            this.inspectNode(sourceFile, typeChecker, types);
        }
    }
    inspectNode(node, typeChecker, allTypes) {
        switch (node.kind) {
            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.EnumDeclaration:
            case ts.SyntaxKind.TypeAliasDeclaration:
                if (!this.isExportType(node) ||
                    this.isGenericType(node)) {
                    return;
                }
                allTypes.set(this.getFullName(node, typeChecker), node);
                break;
            default:
                ts.forEachChild(node, (subnode) => this.inspectNode(subnode, typeChecker, allTypes));
                break;
        }
    }
    isExportType(node) {
        const localSymbol = symbolAtNode_1.localSymbolAtNode(node);
        return localSymbol ? 'exportSymbol' in localSymbol : false;
    }
    isGenericType(node) {
        return !!(node.typeParameters && node.typeParameters.length > 0);
    }
    getFullName(node, typeChecker) {
        const symbol = symbolAtNode_1.symbolAtNode(node);
        return typeChecker.getFullyQualifiedName(symbol).replace(/".*"\./, '');
    }
}
exports.SchemaGenerator = SchemaGenerator;
//# sourceMappingURL=SchemaGenerator.js.map