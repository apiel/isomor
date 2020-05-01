import { outputFile } from 'fs-extra';
import { join } from 'path';

export const FILE_COLOR = join(__dirname, '..', 'color.txt');

export default async function(color: string = 'green'): Promise<string> {
    console.log('setColor', { color });
    outputFile(FILE_COLOR, color);
    return color;
}

