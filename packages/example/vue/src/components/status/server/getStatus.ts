import { remote } from "isomor";
import { CpuInfo } from "os";
export interface Status {
  uptime: number;
  cpus: CpuInfo[];
  totalmem: number;
  freemem: number;
}
export function getStatus(...args: any) {
  return remote("components-status-server-getStatus", "getStatus", args);
}