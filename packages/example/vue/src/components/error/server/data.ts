import { remote } from "isomor";
export function getSomethingWithError(...args: any) {
  return remote("components-error-server-data", "getSomethingWithError", args);
}