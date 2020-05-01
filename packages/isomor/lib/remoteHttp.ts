import { getUrlPath } from '.';

export async function isomorRemoteHttp(
    baseUrl: string,
    moduleName: string,
    funcName: string,
    args: any[],
): Promise<any> {
    const url = baseUrl + getUrlPath(moduleName, funcName);
    const { result, error } = await fetch(
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
    if (error) {
        throw error;
    }
    return result;
}
