import { Module } from '@nestjs/common';
import { ApiModule } from '../api.module';
import { UptimeService } from '../data/uptime/uptime.service';
import { UptimeModule } from '../data/uptime/uptime.module';

@Module({
  imports: [
    ApiModule,
    UptimeModule,
  ],
  providers: [UptimeService],
})
export class ApplicationModule {}
