import { Injectable } from '@nestjs/common'; // > import { Injectable } from '@angular/core';
import { isomor } from 'isomor';
import { UptimeService } from './data/uptime/uptime.service';

@Injectable()
@isomor
export class ApiService {
  constructor(
    private readonly uptimeService: UptimeService,
  ) {}

  async uptime() {
    return this.uptimeService.uptime();
  }

  async test(req?: any) {
    return req.baseUrl;
  }
}
