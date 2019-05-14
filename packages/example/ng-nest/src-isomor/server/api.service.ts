import { Injectable } from '@nestjs/common'; // > import { Injectable } from '@angular/core';
import { isomor } from 'isomor';
// import { Context } from 'isomor-server';
import { UptimeService } from './data/uptime/uptime.service';

@Injectable()
@isomor
export class ApiService {
  // context: Context;
  constructor(
    private readonly uptimeService: UptimeService,
  ) {}

  async uptime() {
    return this.uptimeService.uptime();
  }
}
