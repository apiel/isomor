import { Injectable } from '@nestjs/common'; // > import { Injectable } from '@angular/core';
import { uptime } from 'os';

@Injectable()
export class ApiService {
  constructor() {}

  async uptime() {
    return uptime();
  }
}