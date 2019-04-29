import { remote } from "isomor";
import { Context } from "isomor-server";
export function getAuth(...args: any) {
  return remote("auth-server-auth", "getAuth", args);
}
export function setAuth(...args: any) {
  return remote("auth-server-auth", "setAuth", args);
}