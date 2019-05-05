import { outputFile, readFile, pathExists } from 'fs-extra';

const file = './data/count.txt';

export const getCount = async (): Promise<number> => {
    if (!(await pathExists(file))) {
        return 0;
    }
    return parseInt((await readFile(file)).toString(), 10);
}

export const increment = async (): Promise<number> => {
    const value = await getCount();
    const newValue = value + 1;
    await outputFile(file, newValue);
    // console.log('newValue', newValue);
    return newValue;
}
