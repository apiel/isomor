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
    console.log('this.uptimeService', this.uptimeService);
    return this.uptimeService.uptime();
  }
}
