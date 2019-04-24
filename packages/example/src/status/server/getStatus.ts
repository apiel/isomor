import { remote } from "isomor";
export interface CpuInfo {
  model: string;
  speed: number;
}
export interface Status {
  uptime: number;
  cpus: CpuInfo[];
  totalmem: number;
  freemem: number;
}
export function getStatus(...args: any) {
  return remote("status-server-getStatus", "getStatus", args);
}