export declare const codeTranspiledFunc = "export function getTime(...args: any) {\n  return isomorRemote(\"http\", \"path/to/file\", \"root\", \"getTime\", args);\n}";
export declare const codeTranspiledFuncForWs = "export function getTime(...args: any) {\n  return isomorRemote(\"ws\", \"path/to/file\", \"root\", \"getTime\", args);\n}";
export declare const codeTranspiledFuncNoType = "export function getTime(...args) {\n  return isomorRemote(\"http\", \"path/to/file\", \"root\", \"getTime\", args);\n}";
export declare const codeTranspiledArrowFunc = "export const getTime = (...args: any) => {\n  return isomorRemote(\"http\", \"path/to/file\", \"root\", \"getTime\", args);\n};";
export declare const codeTranspiledArrowFuncNoType = "export const getTime = (...args) => {\n  return isomorRemote(\"http\", \"path/to/file\", \"root\", \"getTime\", args);\n};";
export declare const codeTranspiledClass = "async getTime(...args: any) {\n  return isomorRemote(\"http\", \"path/to/file\", \"root\", \"getTime\", args, \"CatsService\");\n}";
