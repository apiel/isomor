import { readdir } from 'fs-extra';

import { GetListInput } from './getList.input';

function rand() {
    return Math.floor(Math.random() * 1000);
}

export async function getList(input: GetListInput): Promise<string[]> {
    const files = await readdir('./');
    return files.map(file => `${file}-${input.foo}-${rand()}`);
}
