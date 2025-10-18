import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoPlayerComponent } from 'src/app/asset/video.player/video.player.component';
import { VideoURL } from 'src/app/models/VideoURL';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-video.player.wrapper',
  imports:[
    VideoPlayerComponent
  ],
  templateUrl: './video.player.wrapper.component.html',
  styleUrl: './video.player.wrapper.component.css',
  standalone:true,
  
})
export class VideoPlayerWrapperComponent {
  object:VideoURL;
constructor(private route: ActivatedRoute) { 
 this.object ={
    VideoURL:{
      1080:'/assets/Dash/dash.mpd',
      720:'/assets/Dash/720/dash.mpd',
      480:'/assets/Dash/480/dash.mpd'
    },
    ImageURL: {
      ImageUrl:environment.baseurl + 'teacher/playvideo/poster/' + this.route.snapshot.params['id']
    }
  }
}
    // video_url = environment.baseurl + 'teacher/playvideo/' + this.route.snapshot.params['id'];
    // image_url = environment.baseurl + 'teacher/playvideo/poster/' + this.route.snapshot.params['id'];
  
}
