import { readdir } from 'fs-extra';

// interface not yet possible
// import { GetListInput } from '../interface/getList.input';

export async function getList(input: { foo: string }): Promise<string[]> {
    const files = await readdir('./');
    return files.map(file => `${file}-${input.foo}-${Math.random()}`);
}
