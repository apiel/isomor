import { readFile, outputFile, pathExists } from 'fs-extra';

const file = './data/color.txt';

export async function getColor(): Promise<string> {
    if (!(pathExists(file))) {
        return 'red';
    }
    return (await readFile(file)).toString();
}

export async function setColor(color: string = 'green'): Promise<string> {
    outputFile(file, color);
    return color;
}
