import { readFile, pathExists } from 'fs-extra';
import { join } from 'path';

export const FILE_COLOR = join(__dirname, '..', 'color.txt');

export default async function getColor(): Promise<string> {
    if (await pathExists(FILE_COLOR)) {
        const color = await readFile(FILE_COLOR);
        return color.toString();
    }
    return 'blue';
}
