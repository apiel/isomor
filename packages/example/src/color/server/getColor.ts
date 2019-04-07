import { remote } from "isomor";
export function getColor(...args: any) {
  return remote("color-server-getColor", "getColor", args);
}