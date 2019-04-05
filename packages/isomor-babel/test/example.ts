import { readdir } from 'fs-extra';

export interface GetListInput {
    foo: string;
}

export async function getList(): Promise<string[]> {
    const files = await readdir('./');
    return files.map(file => `${file}-${Math.random()}`);
}

export async function getListFoo(input: { foo: string }): Promise<string[]> {
    const files = await readdir('./');
    return files.map(file => `${file}-${input.foo}-${Math.random()}`);
}

export const getList2 = async (hello: string) => {
    const files = await readdir('./');
    return files.map(file => `${file}-${Math.random()}`);
};

// export const getList2 = (...args: any) => {
//     return remote("example", "getList2", args);
// };
