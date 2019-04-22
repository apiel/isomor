export declare const isomorImport = "import { remote } from \"isomor\";";
export declare const codeTranspiledFunc = "export function getTime(...args: any) {\n  return remote(\"path/to/file\", \"getTime\", args);\n}";
export declare const codeTranspiledFuncNoType = "export function getTime(...args) {\n  return remote(\"path/to/file\", \"getTime\", args);\n}";
export declare const codeTranspiledArrowFunc = "export const getTime = (...args: any) => {\n  return remote(\"path/to/file\", \"getTime\", args);\n};";
export declare const codeTranspiledArrowFuncNoType = "export const getTime = (...args) => {\n  return remote(\"path/to/file\", \"getTime\", args);\n};";