import { Component, OnInit ,ElementRef, Input, OnDestroy,ViewChild, ViewEncapsulation } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

// import { PlyrComponent } from 'ngx-plyr';
import { SimplebarAngularModule } from 'simplebar-angular';

import{HlsjsPlyrDriver} from './../play-setup/play-setup.component'
import  Hls from 'hls.js';
import { VideoPlayerComponent } from 'src/app/asset/video.player/video.player.component';
import { StogageService } from 'src/app/services/stogage.service';
import { VideoURL } from 'src/app/models/VideoURL';
import { StudentVideoService } from '../../service/student-video.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
  standalone:true,
  imports:[
    CommonModule,
    VideoPlayerComponent
  ]
})

export class PlayComponent  {
  object:VideoURL;
  key;
  isloading:boolean = false;
  loadError: string | null = null;
constructor(private route: ActivatedRoute, private video:StudentVideoService,private localstorage :StogageService) {
}
  ngOnInit(): void {
    this.isloading=false;
    this.loadError = null;
this.video.fectchkey(this.route.snapshot.params['id']).subscribe({
  next: (data) => {
    if (!data || data.status !== true) {
      this.loadError = (data as any)?.message || 'Failed to load video (issue-key returned error)';
      return;
    }
    if (!data?.video?.urls || (!data.video.urls['1080p'] && !data.video.urls['720p'] && !data.video.urls['480p'])) {
      this.loadError = 'Video has no processed streams yet (urls missing). It may still be processing.';
      return;
    }
    this.object = {
      username: this.localstorage.student_get('student_username'),
      email: this.localstorage.student_get('student_email'),
      query_token: this.localstorage.student_get('student_query_token'),
      ...data
    }
    console.log(this.object);

    this.isloading = true;
  },
  error: (err) => {
    this.loadError = err?.message || 'Failed to load video. Please retry.';
  }
})

  }

    // video_url = environment.baseurl + 'teacher/playvideo/' + this.route.snapshot.params['id'];
    // image_url = environment.baseurl + 'teacher/playvideo/poster/' + this.route.snapshot.params['id'];
  
}
