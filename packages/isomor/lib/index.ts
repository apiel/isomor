/**
 * IMPORTANT: this file should never import node files,
 * even if it's just for types, some library like angular
 * dont like it!
 */

import axios from 'axios';

const urlPrefix = '/isomor'; // http://127.0.0.1:3000/

export function getJsonSchemaFileName(
    path: string,
    name: string,
    className?: string,
) {
    return className ?  `${path}.${className}.${name}.json` : `${path}.${name}.json`;
}

export function getUrl(
    path: string,
    funcName: string,
    classname?: string,
): string {
    const url = classname
        ? `${urlPrefix}/${path}/${classname}/${funcName}`
        : `${urlPrefix}/${path}/${funcName}`;

    return url;
}

export async function isomorRemote(
    path: string,
    funcName: string,
    args: any,
    classname?: string,
): Promise<any> {
    const url = getUrl(path, funcName, classname);
    const { data: { result } } = await axios.post(url, { args });
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
