import { remote } from "isomor";
import { readdir } from "fs-extra";
export function getList(...args: any) {
  return remote("sub-folder-server-data", "getList", args);
}