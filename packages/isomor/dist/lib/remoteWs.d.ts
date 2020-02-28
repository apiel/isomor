export declare type SubscribeFn = (payload: any) => void;
export declare function isomorRemoteWs(baseUrl: string, path: string, pkgname: string, funcName: string, args: [], classname?: string): Promise<any>;
export declare function subscribe(fn: SubscribeFn): number;
export declare function unsubscribe(key: number): void;
