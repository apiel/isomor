import { Component, OnInit } from '@angular/core';
import { ApiService } from '../server/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-ng-app';
  uptime: number;

  constructor(
    private apiService: ApiService,
  ) { }

  async ngOnInit() {
    console.log('ngOnInit');
    this.uptime = await this.apiService.uptime();
  }
}
