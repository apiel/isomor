import axios from 'axios';

const urlPrefix = '/isomor'; // http://127.0.0.1:3000/

export async function remote(
    path: string,
    funcName: string,
    args: any,
): Promise<any> {
    const { data } = await axios.post(
        `${urlPrefix}/${path}/${funcName}`,
        { args },
    );
    return data;
}
