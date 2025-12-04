import { ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import Hls from 'hls.js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-video-player-hls',
  standalone: true,
  templateUrl: './video.player.hls.component.html',
  styleUrls: ['./video.player.hls.component.css']
})
export class VideoPlayerHlsComponent {
  @ViewChild('mainVideo', { static: false }) videoRef?: ElementRef<HTMLVideoElement>;
  private hls?: Hls;
  private mainVideo?: HTMLVideoElement;

  @Input() stream_key?: string; // may arrive asynchronously
  @Input() autoPlay = true;
  @Input() muted = true;
  private lastFragmentTime?: number;

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.mainVideo = this.videoRef?.nativeElement ?? undefined;
    if (!this.mainVideo) {
      console.error('❌ <video #mainVideo> not found.');
      return;
    }

    this.mainVideo.autoplay = this.autoPlay;
    this.mainVideo.muted = this.muted;
    this.mainVideo.playsInline = true;

    // If stream_key already available, start immediately
    if (this.stream_key) {
      this.initializeHls();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Whenever the stream_key input changes
    if (changes['stream_key'] && changes['stream_key'].currentValue) {
      console.log('🎥 Stream key updated:', this.stream_key);
      // Wait until video element exists
      if (this.mainVideo) {
        this.initializeHls();
      } else {
        // retry once the view is ready
        setTimeout(() => this.initializeHls(), 300);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.hls) {
      this.hls.destroy();
      this.hls = undefined;
    }
  }

  /** Initialize HLS for the given stream key */
  private initializeHls(): void {
    if (!this.stream_key) {
      console.warn('⚠️ Stream key not yet available — skipping init');
      return;
    }

    const hlsUrl = `${environment.live_url}${this.stream_key}.m3u8`;
    console.log('🎬 Initializing HLS with URL:', hlsUrl);

    if (!this.mainVideo) {
      console.warn('⚠️ Video element not found yet — will retry');
      setTimeout(() => this.initializeHls(), 300);
      return;
    }

    // cleanup any existing instance
    if (this.hls) {
      this.hls.destroy();
      this.hls = undefined;
    }

    if (this.mainVideo.canPlayType('application/vnd.apple.mpegurl')) {
      // ✅ Native Safari support
      this.mainVideo.src = hlsUrl;
      this.mainVideo.load();
      this.mainVideo.play().catch(err => console.warn('Autoplay blocked:', err));
    } else if (Hls.isSupported()) {
      // ✅ Use hls.js for Chrome/Edge/Firefox
      this.hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        liveSyncDuration: 2,
        liveMaxLatencyDuration: 8,
        maxBufferLength: 10,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
        maxMaxBufferLength: 20,
        backBufferLength: 30,
        startPosition: -1,
        appendErrorMaxRetry: 5
      });

      this.hls.loadSource(hlsUrl);
      this.hls.attachMedia(this.mainVideo);

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ HLS manifest loaded');
        if (this.autoPlay) {
          this.mainVideo?.play().catch(err => console.warn('Autoplay blocked:', err));
        }
      });

      this.hls.on(Hls.Events.ERROR, (event, data) => {
        console.warn('⚠️ HLS error:', data.type, data.details, data.fatal);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('🔄 Trying to recover network error');
              this.hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('🔄 Trying to recover media error');
              this.hls?.recoverMediaError();
              break;
            default:
              console.error('💀 Unrecoverable error. Reloading...');
              this.initializeHls();
              break;
          }
        }
      });
      this.hls.on(Hls.Events.FRAG_LOADING, () => {
        this.lastFragmentTime = Date.now();
      });

      setInterval(() => {
        if (this.lastFragmentTime && Date.now() - this.lastFragmentTime > 10000) {
          console.warn('⚠️ No fragments loaded recently, reconnecting...');
          this.initializeHls();
        }
      }, 10000);



    } else {
      console.error('❌ HLS not supported in this browser');
    }
  }
}
