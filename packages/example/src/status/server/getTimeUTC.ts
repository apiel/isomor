import { remote } from "isomor";
export interface ServerTimeUTC {
  time: string;
}
export function getTimeUTC(...args: any) {
  return remote("status-server-getTimeUTC", "getTimeUTC", args);
}