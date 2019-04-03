import { remote } from 'isomor';

export function getList(...args: any) {
  return remote('data', 'getList', args);
}
