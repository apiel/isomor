import axios from 'axios';

const urlPrefix = '/isomor'; // http://127.0.0.1:3000/

export async function remote(
    fileName: string,
    funcName: string,
    args: any,
): Promise<any> {
    const { data } = await axios.post(
        `${urlPrefix}/${fileName}/${funcName}`,
        { args },
    );
    return data;
}
