import { remote } from "isomor";
export interface GetListInput {
  foo: string;
}
export function getList(...args: any) {
  return remote("server-data", "getList", args);
}
export function getListFoo(...args: any) {
  return remote("server-data", "getListFoo", args);
}
export const getList2 = (...args: any) => {
  return remote("server-data", "getList2", args);
};