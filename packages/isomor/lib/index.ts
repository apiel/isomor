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
