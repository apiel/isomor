import { remote } from "isomor";
import { readdir } from "fs-extra";
export function getList(...args: any) {
  return remote("server-data", "getList", args);
}