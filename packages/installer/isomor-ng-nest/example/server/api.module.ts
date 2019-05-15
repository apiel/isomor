import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { UptimeModule } from './data/uptime/uptime.module';

@Module({
  providers: [ApiService],
  imports: [UptimeModule],
})
export class ApiModule {}
