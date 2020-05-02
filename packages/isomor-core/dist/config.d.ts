export declare type Extensions = [string, ...string[]];
export interface CommonOptions {
    moduleName: string;
    moduleFolder: string;
    serverFolder: string;
    jsonSchemaFolder: string;
    extensions: Extensions;
}
export interface TranspilerOptions {
    srcFolder: string;
    noValidation: boolean;
    watchMode: boolean;
}
export interface ServerOptions {
    port: number;
    staticFolder: string | null;
    startupFile: string;
}
export interface WsOptions {
    wsReg: RegExp | undefined;
    wsBaseUrl: string;
    wsTimeout: number;
}
export interface HttpOptions {
    httpBaseUrl: string;
}
export declare type Options = CommonOptions & TranspilerOptions & ServerOptions & WsOptions & HttpOptions;
export declare function getOptions(): Options;
