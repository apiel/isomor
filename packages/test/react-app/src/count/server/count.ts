import { remote } from "isomor";
export const getCount = (...args: any) => {
  return remote("count-server-count", "getCount", args);
};
export const increment = (...args: any) => {
  return remote("count-server-count", "increment", args);
};