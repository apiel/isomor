import { remote } from "isomor";
export function getColor(...args: any) {
  return remote("color-server-color", "getColor", args);
}
export function setColor(...args: any) {
  return remote("color-server-color", "setColor", args);
}