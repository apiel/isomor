import axios from 'axios';

const urlPrefix = '/isomor'; // http://127.0.0.1:3000/

export async function remote(
    path: string,
    funcName: string,
    args: any,
    classname?: string,
): Promise<any> {
    const url = classname
        ? `${urlPrefix}/${path}/${classname}/${funcName}`
        : `${urlPrefix}/${path}/${funcName}`;

    const { data } = await axios.post(url, { args });
    return data;
}

export type IsomorShare = any;
