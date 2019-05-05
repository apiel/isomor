import { remote } from "isomor";
import { outputFile, readFile, pathExists } from "fs-extra";
export const getCount = (...args: any) => {
  return remote("count-server-count", "getCount", args);
};
export const increment = (...args: any) => {
  return remote("count-server-count", "increment", args);
};