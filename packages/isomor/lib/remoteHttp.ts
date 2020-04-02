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
    const { result } = await fetch(
        url,
        !args.length
            ? undefined
            : {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json;charset=UTF-8',
                  },
                  body: JSON.stringify({ args }),
              },
    ).then(response => response.json());
    return result;
}
