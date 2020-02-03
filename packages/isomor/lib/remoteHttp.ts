import Axios from 'axios';
import { getUrlPath } from '.';

export async function isomorRemoteHttp(
    baseUrl: string,
    path: string,
    pkgname: string,
    funcName: string,
    args: [],
    classname?: string,
): Promise<any> {
    const url = baseUrl + getUrlPath(path, pkgname, funcName, classname);
    const { data: { result } } = await Axios.request({
        url,
        ...(args.length
            ? { method: 'POST', data: { args } }
            : { method: 'GET' }),
    });
    return result;
}
