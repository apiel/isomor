export interface CommonOptions {
    pkgName: string;
    distAppFolder: string;
    serverFolder: string;
    jsonSchemaFolder: string;
}
export interface TranspilerOptions {
    srcFolder: string;
    noValidation: boolean;
    withTypes: boolean;
    watchMode: boolean;
    noServerImport: boolean;
    noDecorator: boolean;
}
export interface ServerOptions {
    port: number;
    staticFolder: string | null;
    startupFile: string;
    distServerFolder: string;
}
export interface WsOptions {
    wsReg: RegExp | undefined;
    wsBaseUrl: string;
}
export interface HttpOptions {
    httpBaseUrl: string;
}
export declare type Options = CommonOptions & TranspilerOptions & ServerOptions & WsOptions & HttpOptions;
export declare function getOptions(): Options;
