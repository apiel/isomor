import { remote } from "isomor";
export type ServerTimeUTC = any;
export function getTimeUTC(...args: any) {
  return remote("status-server-getTimeUTC", "getTimeUTC", args);
}