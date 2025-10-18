import { Component, inject, OnInit } from '@angular/core';
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
import { NavigationService } from 'src/app/services/navigation.service';
import { NotificationMapService } from 'src/app/services/notification-map.service';
import { ProfileService } from 'src/app/services/profile.service';
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
   menuService = inject(NavigationService);
notificationService = inject(NotificationMapService);
ProfileService = inject(ProfileService);

  constructor( private Routes: Router, private notification: NotificationService, public loaderservice: LoaderService) {


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
  menuServieceContoller(){
    this.menuService.toggleDesktopPanel()
    if(this.ProfileService.showDesktopPanel){
      this.ProfileService.closeDesktopPanel()
    }
  }
  ProfileServiceController(){
    this.ProfileService.toggleDesktopPanel()
  
    if(this.menuService.showDesktopPanel){
      this.menuService.closeDesktopPanel()
    }
}}
