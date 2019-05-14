import axios from 'axios';
import { getUrl } from 'isomor-server';

export async function remote(
    path: string,
    funcName: string,
    args: any,
    classname?: string,
): Promise<any> {
    const url = getUrl(path, funcName, classname);
    const { data } = await axios.post(url, { args });
    return data;
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
