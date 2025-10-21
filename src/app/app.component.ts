import { Component, ViewChild, OnInit, inject } from '@angular/core';
// import { PlyrComponent } from 'ngx-plyr';
import { LoaderService } from './loader/loader.service';
import{HlsjsPlyrDriver} from './student/video/play-setup/play-setup.component'
import { PushnotificationService } from './services/pushnotification.service';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  group,
} from '@angular/animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone:false,
})
export class AppComponent implements OnInit{
    pushService = inject(PushnotificationService);

  title = 'school';
  constructor(  public loaderservice:LoaderService  ) {}
  ngOnInit(): void {
        this.pushService.init(); 
  }
Isloading =true

  getRouteAnimationData(outlet: RouterOutlet) {
    return (
      outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']
    );
  }


}
