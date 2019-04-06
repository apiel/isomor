import { remote } from "isomor";
export function getList(...args: any) {
  return remote("sub-folder-server-data", "getList", args);
}