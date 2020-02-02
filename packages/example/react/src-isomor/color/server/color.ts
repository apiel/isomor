import { readFile, pathExists, outputFile } from 'fs-extra';
import { join } from 'path';

const FILE_COLOR = join(__dirname, '../../../data/color.txt');

export async function getColor(): Promise<string> {
    if (await pathExists(FILE_COLOR)) {
        const color = await readFile(FILE_COLOR);
        return color.toString();
    }
    return 'blue';
}

export async function setColor(color: string = 'green'): Promise<string> {
    console.log('setColor', { color });
    outputFile(FILE_COLOR, color);
    return color;
}
