export { subscribe, unsubscribe, SubscribeFn, WsServerAction, WsClientAction, WsConfig, wsDefaultConfig, setWsConfig, openWS, } from './remoteWs';
export declare function getUrlPath(moduleName: string, funcName: string): string;
export declare function setHttpBaseUrl(baseUrl?: string): void;
export declare function setWsBaseUrl(baseUrl?: string): void;
export declare function isomorRemote(protocol: string, baseUrl: string, moduleName: string, funcName: string, args: any[]): Promise<any>;
