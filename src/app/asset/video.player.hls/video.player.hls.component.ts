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

  constructor(private cdr: ChangeDetectorRef) {}

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

    const hlsUrl = `${environment.live_url}${this.stream_key}/index.m3u8`;
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
        console.error('❌ HLS error', data);
      });
    } else {
      console.error('❌ HLS not supported in this browser');
    }
  }
}
