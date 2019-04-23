import { outputFile, readFile } from 'fs-extra';

export const getHello = async () => {
    const file = './data/hello.txt';
    await outputFile(file, 'hello world');
    return (await readFile(file)).toString();
}