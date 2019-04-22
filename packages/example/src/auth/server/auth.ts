import { remote } from "isomor";
export function getAuth(...args: any) {
  return remote("auth-server-auth", "getAuth", args);
}
export function setAuth(...args: any) {
  return remote("auth-server-auth", "setAuth", args);
}