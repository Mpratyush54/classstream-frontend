import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';

import * as $ from 'jquery';
import { LogoutService } from 'src/app/teacher/services/logout.service';
import { NotificationService } from 'src/app/teacher/services/notification.service';
import { StogageService } from 'src/app/services/stogage.service';
import { LoaderService } from '../../loader/loader.service'
import { CommonModule } from '@angular/common';
import { AppModule } from 'src/app/app.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@Component({
  selector: 'app-header-desktop',
  templateUrl: './header-desktop.component.html',
  styleUrls: ['./header-desktop.component.css'],
  providers: [LogoutService],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,

  ]

})
export class HeaderDesktopComponent implements OnInit {
  search;
  constructor(private service: LogoutService, private Routes: Router, private notification: NotificationService, private SwUpdate: SwUpdate, private swPush: SwPush, private localstorage: StogageService, public loaderservice: LoaderService) {


  }

  ngOnInit(): void {
    
  }

  logout() {
    if (event) {
      event.preventDefault()
    }
  }
  teacherroute(data) {
    this.Routes.navigateByUrl(data)
  }
  teacherroute2(data, id) {
    this.notification.onclick(id).subscribe((res: any) => {
    })
    window.open(data, '_blank');
  }
}
