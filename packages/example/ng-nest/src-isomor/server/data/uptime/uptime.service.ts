import { Injectable } from '@nestjs/common'; // > import { Injectable } from '@angular/core';
import { isomor } from 'isomor';
import { uptime } from 'os';

@Injectable()
@isomor
export class UptimeService {
  constructor() {}

  uptime() {
    return uptime();
  }
}
