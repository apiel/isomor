import yo from '../dist/macro';
import { readdir } from 'fs-extra';

import { GetListInput } from './getList.input';

yo('abc');

export async function getList(input: GetListInput): Promise<string[]> {
    const files = await readdir('./');
    return files.map(file => `${file}-${input.foo}-${Math.random()}`);
}
