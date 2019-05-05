import { remote } from "isomor";
import { getConnection } from "typeorm";
export type User = any;
export function getList(...args: any) {
  return remote("server-data", "getList", args);
}