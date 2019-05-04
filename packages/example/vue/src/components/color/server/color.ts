import { remote } from "isomor";
import { readFile, pathExists, outputFile } from "fs-extra";
import { join } from "path";
export function getColor(...args: any) {
  return remote("components-color-server-color", "getColor", args);
}
export function setColor(...args: any) {
  return remote("components-color-server-color", "setColor", args);
}