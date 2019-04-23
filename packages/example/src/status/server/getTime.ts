import { remote } from "isomor";
export type ServerTime = any;
export function getTime(...args: any) {
  return remote("status-server-getTime", "getTime", args);
}