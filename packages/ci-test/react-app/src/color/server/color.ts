import { remote } from "isomor";
import { readFile, outputFile, pathExists } from "fs-extra";
export function getColor(...args: any) {
  return remote("color-server-color", "getColor", args);
}
export function setColor(...args: any) {
  return remote("color-server-color", "setColor", args);
}