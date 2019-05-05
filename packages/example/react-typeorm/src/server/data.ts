import { remote } from "isomor";
import { getConnection } from "typeorm";
export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
}
export function getList(...args: any) {
  return remote("server-data", "getList", args);
}