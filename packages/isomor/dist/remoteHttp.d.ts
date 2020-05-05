interface HttpOptions {
    body?: BodyInit | null;
    headers?: HeadersInit;
    method?: string;
}
declare type HttpClient = (url: string, options?: HttpOptions) => Promise<Response>;
export declare function setHttpClient(client?: HttpClient): void;
export declare function isomorRemoteHttp(baseUrl: string, moduleName: string, funcName: string, args: any[]): Promise<any>;
export {};
