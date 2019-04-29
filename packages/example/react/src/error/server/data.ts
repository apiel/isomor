import { remote } from "isomor";
export function getSomethingWithError(...args: any) {
  return remote("error-server-data", "getSomethingWithError", args);
}