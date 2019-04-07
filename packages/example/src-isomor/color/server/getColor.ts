import { readFile, pathExists } from 'fs-extra';
import { join } from 'path';

export async function getColor(): Promise<string> {
    const file = join(__dirname, 'data/color.txt');
    if (await pathExists(file)) {
        const color = await readFile(file);
        return color.toString();
    }
    return 'red';
}
