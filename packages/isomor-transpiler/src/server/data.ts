import { remote } from "isomor";
export interface GetListInput {
  foo: string;
}
export function getList(...args) {
  return remote("server-data", "getList", args);
}
export function getListFoo(...args) {
  return remote("server-data", "getListFoo", args);
}
export const getList2 = (...args) => {
  return remote("server-data", "getList2", args);
};