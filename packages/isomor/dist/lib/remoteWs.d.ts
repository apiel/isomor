export declare type SubscribFn = (payload: any) => void;
export declare function isomorRemoteWs(path: string, pkgname: string, funcName: string, args: [], classname?: string): Promise<any>;
export declare function subscrib(fn: SubscribFn): number;
export declare function unsubscrib(key: number): void;
