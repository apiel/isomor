import { remote } from "isomor";
export const getHello = (...args: any) => {
  return remote("server-data", "getHello", args);
};