import { remote } from "isomor";
import { outputFile, readFile } from "fs-extra";
export const getHello = (...args: any) => {
  return remote("server-data", "getHello", args);
};