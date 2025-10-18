import { AfterViewInit, Component, Input, input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as dashjs from 'dashjs';
import { VideoURL } from 'src/app/models/VideoURL';

@Component({
  selector: 'app-video-player',
  imports: [],
  templateUrl: './video.player.component.html',
  styleUrl: './video.player.component.css',
  standalone:true
})
export class VideoPlayerComponent implements OnInit, AfterViewInit{
 constructor(private route: ActivatedRoute) { }
    @Input() data_object: VideoURL;
  @Input() image_url: string;
  data: any
  player: any
  video: any
   navigatorAny: any = navigator;
  touchedcusomvideoquality: boolean = false
  container:HTMLElement 
  mainVideo
  videoTimeline:HTMLProgressElement
  progressBar:HTMLDivElement 
  volumeBtn 
  volumeSlider

  currentVidTime:HTMLParagraphElement 
  videoDuration:HTMLParagraphElement
  skipBackward
  skipForward 
  playPauseBtn 
  speedBtn 
  qualityBtn
  speedOptions 
  qualityoptions 
  pipBtn 
  fullScreenBtn 
  thumnailimg: HTMLImageElement
  isScrubbing: boolean = false
  WasPaused 
  ngOnInit(): void {
    this.data = {
      fluid: true,
      aspectRatio: '1920:1080',
      autoplay: true,
      poster: `${this.data_object.ImageURL.ImageUrl}`,

      sources: [{
        src: `${this.data_object.VideoURL[1080]}`,
        type: 'video/mp4',

      }]
    }
    this.video = document.getElementById('my-video');
    this.player = dashjs.MediaPlayer().create();
  }

  ngAfterViewInit(): void { 



    this.container = document.querySelector(".container")
    this.mainVideo = this.container.querySelector("video")
    this.videoTimeline = this.container.querySelector(".video-timeline")
    this.progressBar = this.container.querySelector(".progress-bar")
    this.volumeBtn = this.container.querySelector(".volume i")
    this.volumeSlider = this.container.querySelector(".left input") as HTMLInputElement;
  
    this.currentVidTime = this.container.querySelector(".current-time")
    this.videoDuration = this.container.querySelector(".video-duration")
    this. skipBackward = this.container.querySelector(".skip-backward i")
    this. skipForward = this.container.querySelector(".skip-forward i")
    this.  playPauseBtn = this.container.querySelector(".play-pause i")
    this.  speedBtn = this.container.querySelector(".playback-speed span")
    this. qualityBtn = this.container.querySelector(".quality-selector-button span")
    this. speedOptions = this.container.querySelector(".speed-options")
    this. qualityoptions = this.container.querySelector(".quality-options")
    this. pipBtn = this.container.querySelector(".pic-in-pic span")
    this. fullScreenBtn = this.container.querySelector(".fullscreen i")
    this. thumnailimg = this.container.querySelector(".video-thumnail");
    this.isScrubbing = false
      this.WasPaused = this.mainVideo.paused
    this.player.initialize(this.video, "/assets/Dash/dash.mpd", true);


    this.player.on('loadedmetadata', function () {
      var availableBitrates = this.getAvailableBitrates();
      this.setBitrate(availableBitrates[0]);
    });

    this.player.on('playing', function () {



      setInterval(function () {
        if (this.touchedcusomvideoquality == false) {

          var availableBitrates = this.getAvailableBitrates();
          if (availableBitrates[0] <= 4000000) {
            const ctime = this.mainVideo.currentTime

            this.player.attachSource(this.data_object.VideoURL[1080])

            this.mainVideo.currentTime = ctime

          } else if (availableBitrates[0] >= 4000000 && availableBitrates[0] >= 1200000) {
            const ctime = this.mainVideo.currentTime

            this.player.attachSource(this.data_object.VideoURL[720])

            this.mainVideo.currentTime = ctime
          } else {
            const ctime = this.mainVideo.currentTime

            this.player.attachSource(this.data_object.VideoURL[480])
            this.mainVideo.currentTime = ctime

          }
          this.setBitrate(availableBitrates[0]);


        }
      }, 6000);

    });
    this.hideControls();
    this.container.addEventListener("mousemove", () => {
      this.container.classList.add("show-controls"); clearTimeout(this.timer); this.hideControls();

      event.stopPropagation();

    });


    this.videoTimeline.addEventListener("mousemove", e => {
      this.handlevideomousemove(e)

      // console.log("videoTimeline handlevideomousemove")
      // console.log(e)
      // console.log("videoTimeline handlevideomousemove")

    });

    document.addEventListener("mousemove", e => {
      this.handlevideomousemovefordocument(e)

      // console.log("videoTimeline handlevideomousemove")
      // console.log(e)
      // console.log("videoTimeline handlevideomousemove")

    });
    this.container.addEventListener("mousemove", e => {
      if (this.isScrubbing) {
        this. handlevideomousemove(e)

        // console.log("container handlevideo")
        // console.log(e)
        // console.log("container handlevideo")
      }
    });


    this.videoTimeline.addEventListener("mousedown", e => {


      // console.log("videoTimeline togglescrubbing ")
      // console.log(e)
      // console.log("videoTimeline togglescrubbing ")
      this. togglescrubbing(e)
    });



    this. container.addEventListener("mouseup", e => {
      if (this.isScrubbing) {
        this. togglescrubbing(e)
        //     console.log("container togglescrubbing ")
        // console.log(e)
        // console.log("container togglescrubbing ")

      }
    });
    document.addEventListener("mouseup", e => {
      if (this.isScrubbing) {
        this. togglescrubbingfordocument(e)
        //     console.log("container togglescrubbing ")
        // console.log(e)
        // console.log("container togglescrubbing ")

      }
    });
    this. videoTimeline.addEventListener("click", e => {
      let timelineWidth = this.videoTimeline.clientWidth;
      this. mainVideo.currentTime = (e.offsetX / this.videoTimeline.value) * this.mainVideo.duration;
      event.stopPropagation();

    });

    this. mainVideo.addEventListener("progress", () => {
      if (this.mainVideo.buffered.end && this.mainVideo.duration && this.mainVideo.buffered &&this. mainVideo.buffered.length > 0) {


        const loadedPercentage = (this.mainVideo.buffered.end(0) / this.mainVideo.duration) * 100;

        const progressTime:HTMLProgressElement =this. videoTimeline.querySelector(".progress-bar-loaded");
        progressTime.style.width = `${loadedPercentage}%`

      }
    })
    this.mainVideo.addEventListener("timeupdate", e => {
      timeupdate(e)
    });
    function timeupdate(e) {
      let {
        currentTime, duration
      } = e.target;

      if (!this.video.paused) {
        let percent = (currentTime / duration) * 100;
        this. progressBar.style.width = `${percent}%`;

        this.currentVidTime.innerText = this.formatTime(currentTime);
      }
      event.stopPropagation();

    }

    this.mainVideo.addEventListener("loadeddata", () => {
      this.loadeddata()

    });
    this.volumeBtn.addEventListener("click", () => {
      if (!this.volumeBtn.classList.contains("fa-volume-high")) {
        this.mainVideo.volume = 0.5; this.volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
      } else {
        this. mainVideo.volume = 0.0; this.volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
      }
      this.  volumeSlider.value = this.mainVideo.volume.toString();
      event.stopPropagation();
    
    
    });
    
    
    this.volumeSlider.addEventListener("input", e => {
      const target = e.target as HTMLInputElement;

      this.mainVideo.volume =Number( target.value);
      if (Number( target.value)== 0) {
        return this.volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
      }
      this.volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
      event.stopPropagation();
    
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    this.speedOptions.querySelectorAll("li").forEach(option => {
      option.addEventListener("click", () => {
        this.mainVideo.playbackRate = Number( option.dataset.speed);
        this.speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    
    
      });
    });
    document.addEventListener("click", e => {
      const target = e.target as HTMLElement;
      if (target.tagName !== "SPAN" || target.className !== "material-symbols-rounded") {
        this.speedOptions.classList.remove("show");
        e.stopPropagation();
      }
    });
    
    this.qualityoptions.querySelectorAll("li").forEach(option => {
      option.addEventListener("click", () => {
        if (Number(option.dataset.speed) == 3) {
          this.touchedcusomvideoquality = true
    
          var availableBitratesall = this.getallbitrates();
    
    
          this.setBitrate(availableBitratesall[0]);
    
        } else if (Number(option.dataset.speed)== 2) {
          this.touchedcusomvideoquality = true
          const ctime = this.mainVideo.currentTime
          this.player.attachSource("/assets/Dash/720/dash.mpd")
          this. mainVideo.currentTime = ctime
        } else if (Number(option.dataset.speed) == 1) {
          this.touchedcusomvideoquality = true
          const ctime = this.mainVideo.currentTime
          this. player.attachSource("/assets/Dash/480/dash.mpd")
    
        } else if (Number(option.dataset.speed) == 4) {
          this.touchedcusomvideoquality = false
    
    
    
        }
    
        this.qualityoptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
      });
    });
    document.addEventListener("click", e => {
      const target = e.target as HTMLElement;
      if (target.tagName !== "SPAN" || target.className !== "material-symbols-rounded") {
        this.speedOptions.classList.remove("show");
        e.stopPropagation();
      }
    });
    
    this. fullScreenBtn.addEventListener("click", () => {
      this. container.classList.toggle("fullscreen");
      if (document.fullscreenElement) {
        this. fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen();
      }
      this. fullScreenBtn.classList.replace("fa-expand", "fa-compress");
      this. container.requestFullscreen();
      event.stopPropagation();
    });
    this.  speedBtn.addEventListener("click", () => {
      this.  speedOptions.classList.toggle("show")
      this.  qualityoptions.classList.toggle("hide")
      event.stopPropagation()
    }
    );
    
    this. qualityBtn.addEventListener("click", () => {
      this. qualityoptions.classList.toggle("show")
      this. speedOptions.classList.toggle("hide")
      event.stopPropagation()
    }
    );
    this.  pipBtn.addEventListener("click", () => { this.mainVideo.requestPictureInPicture(); event.stopPropagation() });
    
    this. skipBackward.addEventListener("click", () => {
      this. mainVideo.currentTime -= 5
    
      event.stopPropagation()
    
    });
    this.  skipForward.addEventListener("click", () => { this.mainVideo.currentTime += 5; event.stopPropagation() });
    this.  mainVideo.addEventListener("play", () => { this.playPauseBtn.classList.replace("fa-play", "fa-pause"); event.stopPropagation() });
    this.  mainVideo.addEventListener("pause", () => { this.playPauseBtn.classList.replace("fa-pause", "fa-play"); event.stopPropagation() }
    );
    
    this.playPauseBtn.addEventListener("click", () => {
    
    
      if (this.mainVideo.paused) {
        this. mainVideo.play()
      } else {
        this.mainVideo.pause()
      }
      event.stopPropagation();
    })
    
    this. videoTimeline.addEventListener("mousedown", () => {
      this.videoTimeline.addEventListener("mousemove", this.draggableProgressBar); event.stopPropagation()
    });
    document.addEventListener("mouseup", () => {
      this.  videoTimeline.removeEventListener("mousemove", this.draggableProgressBar); event.stopPropagation()
    
    });
    
    
    this. container.addEventListener("click", () => {
    
      if (this.mainVideo.paused) {
        this. mainVideo.play()
      } else {
        this. mainVideo.pause()
      }
    
    })
    this.container.addEventListener("dblclick", (event: MouseEvent) => {
      if (event.clientX < this.container.offsetLeft + this.container.offsetWidth / 2) {
        this.mainVideo.currentTime -= 10;
      }
      event.stopPropagation();
    });
    

  }
  detectNetworkSpeed() {
    var connection = this.navigatorAny.connection || this.navigatorAny.mozConnection || this.navigatorAny.webkitConnection;
    if (connection) {

      var speedMbps = connection.downlink / 1024;
      var speedrounded = Math.round(speedMbps * 1000)
      return speedrounded;
    } else {
      return null;
    }
  }

  getAvailableBitrates() {
    var bitrates = this.player.getBitrateInfoListFor('video');

    var networkSpeed = this.detectNetworkSpeed();

    var availableBitrates = [];

    if (networkSpeed) {


      for (var i = 0; i < bitrates.length; i++) {


        if (bitrates[i].bitrate < networkSpeed) {
          availableBitrates.push(bitrates[i].bitrate);

        }
      }
    } else {

      availableBitrates.push(bitrates[bitrates.length - 1].bitrate);
    }
    return availableBitrates;

  }


  getallbitrates() {
    var bitrates = this.player.getBitrateInfoListFor('video');

    var availableBitrates = [];


    for (var i = 0; i < bitrates.length; i++) {



      availableBitrates.push(bitrates[i].bitrate);


    }
    return availableBitrates;


  }

  setBitrate(bitrate) {
    this.player.setQualityFor('video', bitrate);
  }




  timer;
  hideControls = () => {
    if (this.mainVideo.paused) return;
    this.timer = setTimeout(() => {
      this.container.classList.remove("show-controls");
    }, 3000);

    event.stopPropagation();

  }

  formatTime = time => {
    let seconds = Math.floor(time % 60)
    let minutes = Math.floor(time / 60) % 60
    let hours = Math.floor(time / 3600);


    let second = seconds < 10 ? `0${seconds}` : seconds;
    let minute = minutes < 10 ? `0${minutes}` : minutes;
    let hour = hours < 10 ? `0${hours}` : hours;
    if (hour == 0) {
      return `${minute}:${second}`
    }
    return `${hour}:${minute}:${second}`;
  }



  togglescrubbing(e) {
    const rect = this.videoTimeline.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width


    this.isScrubbing = (e.buttons & 1) === 1
    this.container.classList.toggle("scrubbing", this.isScrubbing)



    if (this.isScrubbing) {
      this.video.pause()
      this.handlevideomousemove(e)
    } else {
      if (!this.WasPaused) {
        this.mainVideo.currentTime = percent * this.mainVideo.duration


        this.mainVideo.play()
      }


    }

  }

  togglescrubbingfordocument(e) {
    const rect = this.videoTimeline.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width


    this.isScrubbing = (e.buttons & 1) === 1
    this.container.classList.toggle("scrubbing", this.isScrubbing)



    if (this.isScrubbing) {
      this.video.pause()
      this.handlevideomousemovefordocument(e)
    } else {
      if (!this.WasPaused) {
        this.mainVideo.currentTime = percent * this.mainVideo.duration


        this.mainVideo.play()
      }


    }

  }


  handlevideomousemovefordocument(e) {
    let timelineWidth = this.videoTimeline.clientWidth;


    let offsetX = e.offsetX - this.container.getBoundingClientRect().left
    let percent = Math.floor((offsetX / timelineWidth) * this.mainVideo.duration);
    const progressTime = this.videoTimeline.querySelector("span");
    const img = this.videoTimeline.querySelector("img");

    if (offsetX < 40) {
      progressTime.style.left = "4px";
    } else if (timelineWidth - 80 < offsetX) {


      progressTime.style.left = `${timelineWidth - 80 - 71.11111111111111}px`;

    } else if (offsetX > 40 && timelineWidth - 80 > offsetX) {
      progressTime.style.left = `${offsetX - 71.11111111111111}px`;

    }


    //  offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX; progressTime.style.left = `${offsetX-40}px`;
    const percent2 = Math.min(
      Math.max(
        0, e.x - this.videoTimeline.getBoundingClientRect().x),
      this.videoTimeline.getBoundingClientRect().width) / this.videoTimeline.getBoundingClientRect().width

    const imgno = Math.max(1, Math.floor((percent2 *this. mainVideo.duration) / 10));
    img.src = `/assets/Dash/img/image_${imgno}.jpg`


    if (this.isScrubbing) {
      e.preventDefault();
      this.thumnailimg.src = `/assets/Dash/img/image_${imgno}.jpg`
      this.draggableProgressBarfordocument(e)



    }

    // progressTime.innerText = formatTime(percent);
    event.stopPropagation();

  }

  handlevideomousemove(e) {
    let timelineWidth = this.videoTimeline.clientWidth;
    let offsetX = e.offsetX;
    let percent = Math.floor((offsetX / timelineWidth) * this.mainVideo.duration);
    const progressTime = this.videoTimeline.querySelector("span");
    const img = this.videoTimeline.querySelector("img");

    if (offsetX < 40) {
      progressTime.style.left = "4px";
    } else if (timelineWidth - 80 < offsetX) {
      progressTime.style.left = `${timelineWidth - 80 - 71.11111111111111}px`;

    } else if (offsetX > 40 && timelineWidth - 80 > offsetX) {
      progressTime.style.left = `${offsetX - 71.11111111111111}px`;

    }

    //  offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX; progressTime.style.left = `${offsetX-40}px`;
    const percent2 = Math.min(
      Math.max(
        0, e.x - this.videoTimeline.getBoundingClientRect().x),
      this.videoTimeline.getBoundingClientRect().width) / this.videoTimeline.getBoundingClientRect().width

    const imgno = Math.max(1, Math.floor((percent2 * this.mainVideo.duration) / 10));
    img.src = `/assets/Dash/img/image_${imgno}.jpg`


    if (this.isScrubbing) {
      e.preventDefault();
      this.thumnailimg.src = `/assets/Dash/img/image_${imgno}.jpg`
      this.draggableProgressBar(e)



    }

    // progressTime.innerText = formatTime(percent);
    event.stopPropagation();

  }

 loadeddata() {
  this. videoDuration.innerText = this.formatTime(this.mainVideo.duration);

  event.stopPropagation();

}
 draggableProgressBar = e => {


  let timelineWidth = this.videoTimeline.clientWidth;
  this.progressBar.style.width = `${(e.offsetX)}px`;
  this. mainVideo.currentTime = (e.offsetX / timelineWidth) *this. mainVideo.duration; this.currentVidTime.innerText = this.formatTime(this.mainVideo.currentTime);
  event.stopPropagation();

}



 draggableProgressBarfordocument = e => {


  let timelineWidth = this.videoTimeline.clientWidth;





  const percent2 = (e.offsetX)
  console.log(percent2)
  console.log(this.container.getBoundingClientRect())
  console.log(e.offsetX)

  if (percent2 <= this.container.getBoundingClientRect().left) {
    this.progressBar.style.width = "0px"
  } else if (percent2 >= this.container.getBoundingClientRect().right) {

    this.progressBar.style.width = "100%"


  } else {
    this.progressBar.style.width = `${percent2 - this.container.getBoundingClientRect().left}px`;

  }
  this.mainVideo.currentTime = ((e.offsetX - this.container.getBoundingClientRect().left) / timelineWidth) * this.mainVideo.duration;
  this. currentVidTime.innerText = this.formatTime(this.mainVideo.currentTime);

  event.stopPropagation();

}


}
