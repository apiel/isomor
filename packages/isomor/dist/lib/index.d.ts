export declare function getUrl(path: string, pkgname: string, funcName: string, classname?: string): string;
export declare function isomorRemote(protocol: string, path: string, pkgname: string, funcName: string, args: [], classname?: string): Promise<any>;
export declare type IsomorShare = any;
export declare function isomorShare(constructor: any): void;
export declare function isomor(constructor: any): void;
export declare function isIsomorClass(name: string): boolean;
