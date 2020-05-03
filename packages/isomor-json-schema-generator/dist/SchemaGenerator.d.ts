import * as ts from 'typescript';
import { NodeParser } from 'ts-json-schema-generator/dist/src/NodeParser';
import { Schema } from 'ts-json-schema-generator/dist/src/Schema/Schema';
import { TypeFormatter } from 'ts-json-schema-generator/dist/src/TypeFormatter';
export declare class SchemaGenerator {
    private readonly program;
    private readonly nodeParser;
    private readonly typeFormatter;
    constructor(program: ts.Program, nodeParser: NodeParser, typeFormatter: TypeFormatter);
    createSchema(fullName: string, destination?: string): Schema;
    private createSchemaFromNodes;
    private getRootNode;
    private getRootTypeDefinition;
    private appendRootChildDefinitions;
    private partitionFiles;
    private appendTypes;
    private inspectNode;
    private isExportType;
    private isGenericType;
    private getFullName;
}
