/**
 * IMPORTANT: this file should never import node files,
 * even if it's just for types, some library like angular
 * dont like it!
 */
import { isomorRemoteHttp } from './remoteHttp';
import { isomorRemoteWs } from './remoteWs';
export { subscrib, unsubscrib, SubscribFn } from './remoteWs';

const urlPrefix = '/isomor'; // http://127.0.0.1:3000/

export function getUrl(
    path: string,
    pkgname: string,
    funcName: string,
    classname?: string,
): string {
    const url = classname
        ? `${urlPrefix}/${pkgname}/${path}/${classname}/${funcName}`
        : `${urlPrefix}/${pkgname}/${path}/${funcName}`;

    return url;
}

export function isomorRemote(
    protocol: string,
    path: string,
    pkgname: string,
    funcName: string,
    args: [],
    classname?: string,
): Promise<any> {
    if (protocol === 'ws') {
        return isomorRemoteWs(path, pkgname, funcName, args, classname);
    }
    return isomorRemoteHttp(path, pkgname, funcName, args, classname);
}

export type IsomorShare = any;

// @isomorShare
export function isomorShare(constructor: any) {
    //
}

// @isomor
const isomorDecorators: string[] = [];
export function isomor(constructor: any) {
    isomorDecorators.push(constructor.name);
}
export function isIsomorClass(name: string) {
    return isomorDecorators.includes(name);
}
