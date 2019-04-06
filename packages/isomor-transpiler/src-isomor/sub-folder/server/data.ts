import { readdir } from 'fs-extra';

export async function getList(): Promise<string[]> {
    const files = await readdir('./');
    return files.map(file => `${file}-${Math.random()}`);
}
