import { remote } from "isomor";
export function getList(...args) {
  return remote("sub-folder-server-data", "getList", args);
}