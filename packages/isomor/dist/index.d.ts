export declare function getUrl(path: string, funcName: string, classname?: string): string;
export declare function isomorRemote(path: string, funcName: string, args: any, argsObject: object, classname?: string): Promise<any>;
export declare function isomorValidate(params: object, path: string, funcName: string, classname?: string): void;
export declare type IsomorShare = any;
export declare function isomorShare(constructor: any): void;
export declare function isomor(constructor: any): void;
export declare function isIsomorClass(name: string): boolean;
