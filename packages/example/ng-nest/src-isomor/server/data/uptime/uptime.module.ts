import { Module } from '@nestjs/common';
import { UptimeService } from './uptime.service';

@Module({
  providers: [UptimeService],
  exports: [UptimeService],
})
export class UptimeModule {}
