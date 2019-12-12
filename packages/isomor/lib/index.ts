/**
 * IMPORTANT: this file should never import node files,
 * even if it's just for types, some library like angular
 * dont like it!
 */

import axios, { Method } from 'axios';

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

export async function isomorRemote(
    path: string,
    pkgname: string,
    funcName: string,
    args: [],
    classname?: string,
): Promise<any> {
    const url = getUrl(path, pkgname, funcName, classname);
    const { data: { result } } = await axios.request({
        url,
        ...(args.length
            ? { method: 'POST', data: { args } }
            : { method: 'GET' }),
    });
    return result;
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
