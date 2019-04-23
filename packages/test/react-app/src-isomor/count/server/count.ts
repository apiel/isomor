import { outputFile, readFile, pathExists } from 'fs-extra';

const file = './data/count.txt';

export const getCount = async (): Promise<string> => {
    if (!(pathExists(file))) {
        return '0';
    }
    return (await readFile(file)).toString();
}

export const increment = async (): Promise<string> => {
    const value = parseInt(await getCount(), 10);
    const newValue = value + 1;
    await outputFile(file, newValue);
    console.log('newValue', newValue);
    return newValue.toString();
}
