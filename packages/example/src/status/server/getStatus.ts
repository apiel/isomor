import { remote } from "isomor";
export interface Status {
  uptime: number;
  cpus: {
    model: string;
    speed: number;
  }[];
  totalmem: number;
  freemem: number;
}
export function getStatus(...args: any) {
  return remote("status-server-getStatus", "getStatus", args);
}