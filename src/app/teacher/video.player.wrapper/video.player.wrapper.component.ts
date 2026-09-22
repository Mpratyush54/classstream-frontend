import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoPlayerComponent } from 'src/app/asset/video.player/video.player.component';
import { VideoURL } from 'src/app/models/VideoURL';
import { environment } from 'src/environments/environment';
import { VideofetchService } from '../services/videofetch.service';
import { StogageService } from 'src/app/services/stogage.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-video.player.wrapper',
  imports: [
    VideoPlayerComponent,
    CommonModule
],
  templateUrl: './video.player.wrapper.component.html',
  styleUrl: './video.player.wrapper.component.css',
  standalone:true,
  
})
export class VideoPlayerWrapperComponent implements OnInit {
  object:VideoURL;
  key;
  isloading:boolean = false;
  loadError: string | null = null;
constructor(private route: ActivatedRoute, private video:VideofetchService,private localstorage :StogageService) {
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
      username: this.localstorage.teacher_get('teacher_username'),
      email: this.localstorage.teacher_get('teacher_email'),
      query_token: this.localstorage.teacher_get('teacher_query_token'),
      ...data
    }
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
