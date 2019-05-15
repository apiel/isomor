import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UptimeComponent } from './uptime.component';
// import { ApiModule } from '../../server/api.module';

@NgModule({
  declarations: [
    UptimeComponent
  ],
  imports: [
    // ApiModule,
    CommonModule
  ],
})
export class UptimeModule { }
