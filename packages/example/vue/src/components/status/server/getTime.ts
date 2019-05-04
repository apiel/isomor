import { remote } from "isomor";
export interface ServerTime {
  time: string;
}
export function getTime(...args: any) {
  return remote("components-status-server-getTime", "getTime", args);
}