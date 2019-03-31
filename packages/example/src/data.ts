import { magic } from 'isomor';
import { join } from 'path';

export interface Input {
    foo: string;
}

export function getList(input: Input): Promise<string[]> {
    const path = join(__dirname, '../server/data');
    return magic<string[], Input>(() => require(path).getList, input);
}
