import { remote } from "isomor";
export type CpuInfo = any;
export type Status = any;
export function getStatus(...args: any) {
  return remote("status-server-getStatus", "getStatus", args);
}