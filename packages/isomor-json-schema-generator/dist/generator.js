"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchemaGenerator_1 = require("./SchemaGenerator");
const formatter_1 = require("ts-json-schema-generator/dist/factory/formatter");
const program_1 = require("ts-json-schema-generator/dist/factory/program");
const parser_1 = require("./parser");
function createGenerator(config) {
    const program = program_1.createProgram(config);
    const parser = parser_1.createParser(program, config);
    const formatter = formatter_1.createFormatter(config);
    return new SchemaGenerator_1.SchemaGenerator(program, parser, formatter);
}
exports.createGenerator = createGenerator;
//# sourceMappingURL=generator.js.map