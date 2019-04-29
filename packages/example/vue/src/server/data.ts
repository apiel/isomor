import { remote } from "isomor";
export function getServerUptime(...args: any) {
  return remote("server-data", "getServerUptime", args);
}