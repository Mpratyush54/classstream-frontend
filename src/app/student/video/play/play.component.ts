import { Component, OnInit ,ElementRef, Input, OnDestroy,ViewChild, ViewEncapsulation } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

// import { PlyrComponent } from 'ngx-plyr';
import { SimplebarAngularModule } from 'simplebar-angular';

import{HlsjsPlyrDriver} from './../play-setup/play-setup.component'
import  Hls from 'hls.js';
import { VideoPlayerComponent } from 'src/app/asset/video.player/video.player.component';
import { VideofetchService } from 'src/app/teacher/services/videofetch.service';
import { StogageService } from 'src/app/services/stogage.service';
import { VideoURL } from 'src/app/models/VideoURL';
import { StudentVideoService } from '../../service/student-video.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
  standalone:true,
  imports:[
    VideoPlayerComponent
  ]
})

export class PlayComponent  {
  object:VideoURL;
  key;
  isloading:boolean = false;
constructor(private route: ActivatedRoute, private video:StudentVideoService,private localstorage :StogageService) { 
//  private readonly  usernames = this.localstorage.teacher_get('teacher_username')
//  private readonly  emails = this.localstorage.teacher_get('teacher_email')
//  private readonly  query_tokens = this.localstorage.teacher_get('teacher_query_token')
}
  ngOnInit(): void {
    this.isloading=false;
this.video.fectchkey(this.route.snapshot.params['id']).subscribe((data) =>{
   this.object= {
      username:this.localstorage.student_get('student_username'),
      email:this.localstorage.student_get('student_email'),
      query_token:this.localstorage.student_get('student_query_token'),
    ...data
   }
   console.log(this.object);
   
      this.isloading=true;

})

  }

    // video_url = environment.baseurl + 'teacher/playvideo/' + this.route.snapshot.params['id'];
    // image_url = environment.baseurl + 'teacher/playvideo/poster/' + this.route.snapshot.params['id'];
  
}
