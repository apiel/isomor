import Axios from 'axios';
import { getUrl } from '.';

export async function isomorRemoteHttp(
    path: string,
    pkgname: string,
    funcName: string,
    args: [],
    classname?: string,
): Promise<any> {
    const url = getUrl(path, pkgname, funcName, classname);
    const { data: { result } } = await Axios.request({
        url,
        ...(args.length
            ? { method: 'POST', data: { args } }
            : { method: 'GET' }),
    });
    return result;
}
