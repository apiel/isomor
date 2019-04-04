import { remote } from 'isomor';

export interface GetListInput {
    foo: string;
}
export function getList(...args) {
  return remote('data', 'getList', args);
}

export function getListFoo(...args) {
  return remote('data', 'getListFoo', args);
}

export const getList2 = (...args) => {
  return remote('data', 'getList2', args);
}
