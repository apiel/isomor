import { remote } from "isomor";
import { getConnection } from "typeorm";
export function getList(...args: any) {
  return remote("server-data", "getList", args);
}