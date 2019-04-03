import { remote } from 'isomor';

export async function getList(...args: any): Promise<string[]> {
  return remote('data', 'getList', args);
}
