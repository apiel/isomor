import { getUrlPath } from '.';


interface HttpOptions {
    body?: BodyInit | null;
    headers?: HeadersInit;
    method?: string;
}
type HttpClient = (url: string, options?: HttpOptions) => Promise<Response>;
let httpClient: HttpClient;
export function setHttpClient(client: HttpClient = fetch) {
    httpClient = client;
}

function getHttpClient() {
    return httpClient || fetch;
}

export async function isomorRemoteHttp(
    baseUrl: string,
    moduleName: string,
    funcName: string,
    args: any[],
): Promise<any> {
    const url = baseUrl + getUrlPath(moduleName, funcName);
    const { result, error } = await getHttpClient()(
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
