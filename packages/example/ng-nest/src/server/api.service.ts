import { remote } from "isomor";
import { Injectable } from '@angular/core';
// > import { Injectable } from '@angular/core';
import { uptime } from 'os';

@Injectable()
class ApiService__deco_export__ {}

export class ApiService extends ApiService__deco_export__ {
  constructor(...args: any) {
    super(...args);
  }

  async uptime(...args: any) {
    return remote("server-api.service", "uptime", args, "ApiService");
  }

}