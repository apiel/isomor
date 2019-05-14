import { Injectable } from '@nestjs/common'; // > import { Injectable } from '@angular/core';
import { isomor } from 'isomor';
import { uptime } from 'os';

@Injectable()
@isomor
export class ApiService {
  constructor() {}

  async uptime() {
    return uptime();
  }
}
