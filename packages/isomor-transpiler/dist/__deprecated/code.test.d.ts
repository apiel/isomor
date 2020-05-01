export declare const codeTranspiledFunc = "export function getTime(...args: any) {\n  return isomorRemote(\"http\", \"\", \"path/to/file\", \"root\", \"getTime\", args);\n}";
export declare const codeTranspiledFuncForWs = "export function getTime(...args: any) {\n  return isomorRemote(\"ws\", \"ws://127.0.0.1:3005\", \"path/to/file\", \"root\", \"getTime\", args);\n}";
export declare const codeTranspiledFuncNoType = "export function getTime(...args) {\n  return isomorRemote(\"http\", \"\", \"path/to/file\", \"root\", \"getTime\", args);\n}";
export declare const codeTranspiledArrowFunc = "export const getTime = (...args: any) => {\n  return isomorRemote(\"http\", \"\", \"path/to/file\", \"root\", \"getTime\", args);\n};";
export declare const codeTranspiledArrowFuncNoType = "export const getTime = (...args) => {\n  return isomorRemote(\"http\", \"\", \"path/to/file\", \"root\", \"getTime\", args);\n};";
export declare const codeTranspiledClass = "async getTime(...args: any) {\n  return isomorRemote(\"http\", \"\", \"path/to/file\", \"root\", \"getTime\", args, \"CatsService\");\n}";
