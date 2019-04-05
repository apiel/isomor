import 'isomor.macro';
import { remote } from 'isomor';

// test('abc');

export function getList(...args: any) {
  return remote('data', 'getList', args);
}
