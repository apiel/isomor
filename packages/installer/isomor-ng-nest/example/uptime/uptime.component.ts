import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../server/api.service';

@Component({
  selector: 'app-uptime',
  templateUrl: './uptime.component.html',
})
export class UptimeComponent implements OnInit {
  uptime: number;

  constructor(
    private apiService: ApiService,
  ) { }

  async ngOnInit() {
    this.uptime = await this.apiService.uptime();
  }
}
