import { remote } from "isomor";
export function getList(...args: any) {
  return remote("server-data", "getList", args);
}