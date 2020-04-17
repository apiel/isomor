export declare enum WsServerAction {
    PUSH = "PUSH",
    CONF = "CONF",
    API_RES = "API_RES",
    API_ERR = "API_ERR"
}
export declare enum WsClientAction {
    API = "API"
}
export interface WsConfig {
    withCookie: boolean;
}
export declare type SubscribeFn = (payload: any) => void;
export declare const wsDefaultConfig: WsConfig;
export declare function setWsConfig(config: WsConfig): void;
export declare function openWS(baseUrl: string): void;
export declare function isomorRemoteWs(baseUrl: string, path: string, pkgname: string, funcName: string, args: [], classname?: string): Promise<any>;
export declare function subscribe(fn: SubscribeFn): number;
export declare function unsubscribe(key: number): void;
