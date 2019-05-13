import { Module } from '@nestjs/common';
// import { CatsModule } from './cats/cats.module';
import { ApiService } from '../api.service';

@Module({
  imports: [
    // CatsModule,
  ],
  providers: [ApiService],
})
export class ApplicationModule {}
