import { Injectable } from '@nestjs/common'; // > import { Injectable } from '@angular/core';
import { isomor } from 'isomor';
import { getUptime } from './data/uptime';

@Injectable()
@isomor
export class ApiService {
  constructor() {}

  async uptime() {
    return getUptime();
  }
}
