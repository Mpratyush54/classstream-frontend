import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import * as dashjs from 'dashjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-video-player',
  standalone: true,
  templateUrl: './video.player.component.html',
  styleUrls: ['./video.player.component.css'],
})
export class VideoPlayerComponent implements AfterViewInit, OnChanges, OnDestroy {
  private _data_object: any;

  /** match your HTML: <video id="my-video" #mainVideo> */
  @ViewChild('mainVideo', { static: false }) videoRef?: ElementRef<HTMLVideoElement>;
currentQuality
  @Input()
  set data_object(data: any) {
    this._data_object = data;
    // try init if view is ready
    if (this.readyToInitialize() && !this.initialized) {
      this.initializeDash();
      this.initialized = true;
    }
  }
  get data_object(): any {
    return this._data_object;
  }

  /* ---- dash.js & state ---- */
  private player!: dashjs.MediaPlayerClass;
  private initialized = false;
  private currentKid: string | null = null;

  /* ---- DOM handles ---- */
  private container!: HTMLElement;
  private mainVideo!: HTMLVideoElement;

  private videoTimeline!: HTMLElement;
  private progressArea!: HTMLElement;
  private progressBarLoaded!: HTMLElement;
  private progressBar!: HTMLElement;

  private volumeBtn!: HTMLElement;
  private volumeSlider!: HTMLInputElement;
  private currentVidTime!: HTMLParagraphElement;
  private videoDuration!: HTMLParagraphElement;
  private skipBackward!: HTMLElement;
  private skipForward!: HTMLElement;
  private playPauseBtn!: HTMLElement;
  private speedBtn!: HTMLElement;
  private qualityBtn!: HTMLElement;
  private speedOptions!: HTMLElement;
  private qualityoptions!: HTMLElement;
  private pipBtn!: HTMLElement;
  private fullScreenBtn!: HTMLElement;
  private thumnailimg!: HTMLImageElement;

  /* ---- UI state ---- */
  private isScrubbing = false;
  private wasPaused = false;
  private hideTimer: any = null;
  private touchedCustomVideoQuality = false;

  /* ---- net helper ---- */
  private navigatorAny: any = navigator;

  /* ---- cleanup ---- */
  private tryInitInterval: any = null;
  private periodicAbrInterval: any = null;
  private boundDocumentMouseMove?: (e: MouseEvent) => void;
  private boundDocumentMouseUp?: (e: MouseEvent) => void;

  constructor(private cdr: ChangeDetectorRef) {}

  /* ==============================================================
   *                    ANGULAR LIFECYCLE
   * ============================================================== */

  ngAfterViewInit(): void {
    // Bind DOM first (gets #mainVideo)
    this.bindDom();

    if (!this.mainVideo && !this.player) {
      console.error('❌ <video #mainVideo> not found.');
      return;
    }

    this.mainVideo.autoplay = false;
    this.mainVideo.muted = true;
    this.mainVideo.playsInline = true;

    // Create dash.js ONCE (don’t recreate in initializeDash)
if (!this.player) {
  this.player = dashjs.MediaPlayer().create();
  this.player.initialize(this.mainVideo, null, false); // ✅ Important
  this.player.updateSettings({
    debug: { logLevel: 4 },
    streaming: {
      abr: { autoSwitchBitrate: { video: false } },
      buffer: { stableBufferTime: 10 },
      retryIntervals: { MPD: 5000, MediaSegment: 2000 },
      retryAttempts: { MPD: 3, MediaSegment: 3 },
    },
  });
}
    // If both DOM + data are ready, init now; else poll for readiness briefly
    if (this.readyToInitialize() && !this.initialized) {
      this.initializeDash();
      this.initialized = true;
    } else {
      this.tryInitInterval = setInterval(() => {
        if (this.readyToInitialize() && !this.initialized) {
          this.initializeDash();
          this.initialized = true;
          clearInterval(this.tryInitInterval);
          this.tryInitInterval = null;
        }
      }, 150);
    }
const emeEvents = dashjs.MediaPlayer.events;

if (emeEvents?.KEY_SYSTEM_SELECTED)
  this.player.on(emeEvents.KEY_SYSTEM_SELECTED, (e) => console.log('🧩 KEY_SYSTEM_SELECTED:', e));

if (emeEvents?.KEY_SESSION_CREATED)
  this.player.on(emeEvents.KEY_SESSION_CREATED, (e) => console.log('🔐 KEY_SESSION_CREATED:', e));

if (emeEvents?.KEY_MESSAGE)
  this.player.on(emeEvents.KEY_MESSAGE, (e) => console.log('📩 KEY_MESSAGE:', e));

if (emeEvents?.KEY_ADDED)
  this.player.on(emeEvents.KEY_ADDED, (e) => console.log('✅ KEY_ADDED:', e));

if (emeEvents?.KEY_ERROR)
  this.player.on(emeEvents.KEY_ERROR, (e) => console.error('❌ KEY_ERROR:', e));

// Optional EME events available from dash.js 4.x:


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data_object'] && this.readyToInitialize() && !this.initialized) {
      this.initializeDash();
      this.initialized = true;
      if (this.tryInitInterval) {
        clearInterval(this.tryInitInterval);
        this.tryInitInterval = null;
      }
    }
  }

  ngOnDestroy(): void {
    try {
      if (this.periodicAbrInterval) clearInterval(this.periodicAbrInterval);
      if (this.tryInitInterval) clearInterval(this.tryInitInterval);

      if (this.boundDocumentMouseMove) {
        document.removeEventListener('mousemove', this.boundDocumentMouseMove);
        this.boundDocumentMouseMove = undefined;
      }
      if (this.boundDocumentMouseUp) {
        document.removeEventListener('mouseup', this.boundDocumentMouseUp);
        this.boundDocumentMouseUp = undefined;
      }

      if (this.player) this.player.reset();
    } catch (e) {
      console.warn('Player cleanup warning:', e);
    }
  }

  /* ==============================================================
   *                    INITIALIZATION HELPERS
   * ============================================================== */

  private bindDom(): void {
    this.container = document.querySelector('.container') as HTMLElement;
    if (!this.container) {
      console.error('❌ .container not found. Check your HTML structure.');
      return;
    }

    this.mainVideo =
      this.videoRef?.nativeElement ||
      (document.getElementById('my-video') as HTMLVideoElement);

    this.thumnailimg = this.container.querySelector('.video-thumnail') as HTMLImageElement;

    this.videoTimeline = this.container.querySelector('.video-timeline') as HTMLElement;
    this.progressArea = this.videoTimeline?.querySelector('.progress-area') as HTMLElement;
    this.progressBarLoaded = this.videoTimeline?.querySelector('.progress-bar-loaded') as HTMLElement;
    this.progressBar = this.videoTimeline?.querySelector('.progress-bar') as HTMLElement;

    this.volumeBtn = this.container.querySelector('.volume i') as HTMLElement;
    this.volumeSlider = this.container.querySelector('.options.left input') as HTMLInputElement;
    this.currentVidTime = this.container.querySelector('.current-time') as HTMLParagraphElement;
    this.videoDuration = this.container.querySelector('.video-duration') as HTMLParagraphElement;

    this.skipBackward = this.container.querySelector('.skip-backward i') as HTMLElement;
    this.playPauseBtn = this.container.querySelector('.play-pause i') as HTMLElement;
    this.skipForward = this.container.querySelector('.skip-forward i') as HTMLElement;

    this.speedBtn = this.container.querySelector('.playback-speed') as HTMLElement;
    this.qualityBtn = this.container.querySelector('.quality-selector-button') as HTMLElement;
    this.speedOptions = this.container.querySelector('.speed-options') as HTMLElement;
    this.qualityoptions = this.container.querySelector('.quality-options') as HTMLElement;
    this.pipBtn = this.container.querySelector('.pic-in-pic') as HTMLElement;
    this.fullScreenBtn = this.container.querySelector('.fullscreen i') as HTMLElement;

    this.isScrubbing = false;
    this.wasPaused = this.mainVideo?.paused ?? true;

    this.boundDocumentMouseMove = (e: MouseEvent) => this.onDocumentMouseMove(e);
    document.addEventListener('mousemove', this.boundDocumentMouseMove);

    this.boundDocumentMouseUp = (e: MouseEvent) => this.onDocumentMouseUp(e);
    document.addEventListener('mouseup', this.boundDocumentMouseUp);
  }

  private readyToInitialize(): boolean {
    return !!this.mainVideo && !!this.data_object?.video?.urls?.['1080p'];
  }
/** 🌐 Automatically choose playback quality based on network speed
 *  - Respects manual user selection (touchedCustomVideoQuality)
 *  - Uses navigator.connection.downlink (in Mbps)
 *  - Falls back gracefully if unavailable
 */
private getPreferredQuality(): string {
  // 🧠 If user already selected manually, keep it
  if (this.touchedCustomVideoQuality && this.currentQuality) {
    console.log(`🎯 Keeping user-selected quality: ${this.currentQuality}`);
    return this.currentQuality;
  }

  // 🌐 Try to detect current network bandwidth
  const conn =
    this.navigatorAny.connection ||
    this.navigatorAny.mozConnection ||
    this.navigatorAny.webkitConnection;

  const downlinkMbps = conn?.downlink || 3; // fallback if unknown

  console.log(`🌐 Detected network speed: ${downlinkMbps.toFixed(2)} Mbps`);

  // 📈 Pick quality thresholds
  if (downlinkMbps > 5) return '1080p';
  if (downlinkMbps > 2) return '720p';
  return '480p';
}

  /* ==============================================================
   *                    DASH + CLEARKEY INIT
   * ============================================================== */
private async initializeDash(): Promise<void> {
  try {
    const selectedQuality = this.getPreferredQuality();
    this.currentQuality = selectedQuality;

    const data = this._data_object;
    const rawUrl = data?.video?.urls?.[selectedQuality];
    if (!rawUrl) throw new Error(`Video URL missing for ${selectedQuality}`);

      const videoUrl = this.absMedia(rawUrl);
      console.log(`🚀 Initializing DASH for quality: ${selectedQuality}`, videoUrl);
const matchingKey = (data.keys || []).find(
  (item: any) => item.quality === selectedQuality
);

if (!matchingKey) {
  throw new Error(`❌ No matching KID found for quality: ${selectedQuality}`);
}

// Convert kid (hex) → base64url for backend compatibility
console.log(selectedQuality);

      // 🎯 Fetch key from backend
      const { kid, key } = await this.fetchVideoKey(data.video.id, selectedQuality, matchingKey.kid,matchingKey.keyHex);
    if (!kid || !key) throw new Error('Missing KID or KEY from backend');

    // Convert to Base64URL form for ClearKey
    const kidB64 = kid;
    const keyB64 = key;
    const clearkeys: Record<string, string> = { [kidB64]: keyB64 };

    // Apply keys before attaching source
    this.player.setProtectionData({ 'org.w3.clearkey': { clearkeys } });

    this.player.attachSource(videoUrl);

    console.log(`✅ DASH initialized with dynamic key`, { selectedQuality, clearkeys });

    this.attachUiListeners();
  } catch (err) {
    console.error('❌ initializeDash crash:', err);
  }
}



  /* ==============================================================
   *                UI LISTENERS (same behavior)
   * ============================================================== */

  private attachUiListeners(): void {
    this.hideControls();
    this.container.addEventListener('mousemove', () => {
      this.container.classList.add('show-controls');
      clearTimeout(this.hideTimer);
      this.hideControls();
    });

    if (this.videoTimeline) {
      this.videoTimeline.addEventListener('mousemove', (e) => this.handleVideoMouseMove(e));
      this.videoTimeline.addEventListener('mousedown', (e) => this.toggleScrubbing(e));
      this.videoTimeline.addEventListener('click', (e: any) => {
        const rect = this.progressArea.getBoundingClientRect();
        const relX = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
        const pct = relX / rect.width;
        this.mainVideo.currentTime = pct * this.mainVideo.duration;
      });
    }

    this.mainVideo.addEventListener('timeupdate', (e) => this.onTimeUpdate(e));
    this.mainVideo.addEventListener('loadeddata', () => this.onLoadedData());
    this.mainVideo.addEventListener('progress', () => this.onProgressBuffer());

    if (this.volumeBtn) {
      this.volumeBtn.addEventListener('click', () => {
        if (this.mainVideo.volume === 0) {
          this.mainVideo.volume = 0.5;
          this.volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
        } else {
          this.mainVideo.volume = 0;
          this.volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
        }
        if (this.volumeSlider) this.volumeSlider.value = String(this.mainVideo.volume);
      });
    }
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e: any) => {
        const v = parseFloat(e.target.value);
        this.mainVideo.volume = v;
        if (v === 0) this.volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
        else this.volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
      });
    }

    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', () => {
        if (this.mainVideo.paused) this.mainVideo.play();
        else this.mainVideo.pause();
      });
    }
    if (this.skipBackward) {
      this.skipBackward.addEventListener('click', () => (this.mainVideo.currentTime -= 5));
    }
    if (this.skipForward) {
      this.skipForward.addEventListener('click', () => (this.mainVideo.currentTime += 5));
    }
    this.mainVideo.addEventListener('play', () =>
      this.playPauseBtn?.classList?.replace('fa-play', 'fa-pause')
    );
    this.mainVideo.addEventListener('pause', () =>
      this.playPauseBtn?.classList?.replace('fa-pause', 'fa-play')
    );

    this.container.addEventListener('click', () => {
      if (this.mainVideo.paused) this.mainVideo.play();
      else this.mainVideo.pause();
    });

    this.container.addEventListener('dblclick', (event: MouseEvent) => {
      if (event.clientX < this.container.offsetLeft + this.container.offsetWidth / 2) {
        this.mainVideo.currentTime -= 10;
      }
    });

    if (this.speedBtn) {
      this.speedBtn.addEventListener('click', () => {
        this.speedOptions?.classList?.toggle('show');
        this.qualityoptions?.classList?.toggle('hide');
      });
    }
    if (this.speedOptions) {
      this.speedOptions.querySelectorAll('li').forEach((li) => {
        li.addEventListener('click', () => {
          const speedStr = (li as HTMLElement).dataset['speed'];
          const speed = speedStr ? parseFloat(speedStr) : 1;
          this.mainVideo.playbackRate = speed;
          this.speedOptions.querySelector('.active')?.classList?.remove('active');
          li.classList.add('active');
        });
      });
    }

    if (this.qualityBtn) {
      this.qualityBtn.addEventListener('click', () => {
        this.qualityoptions?.classList?.toggle('show');
        this.speedOptions?.classList?.toggle('hide');
      });
    }
    if (this.qualityoptions) {
      this.qualityoptions.querySelectorAll('li').forEach((li) => {
        li.addEventListener('click', () => {
          const sel = Number((li as HTMLElement).dataset['speed'] || '4');
          const t = this.mainVideo.currentTime;

          // 4 Auto (1080 manifest with ABR), 3 1080p, 2 720p, 1 480p
          if (sel === 4) {
            this.touchedCustomVideoQuality = false;
            this.player.attachSource(this.absMedia(this.data_object.video.urls['1080p']));
          } else if (sel === 3) {
            this.touchedCustomVideoQuality = true;
            this.player.attachSource(this.absMedia(this.data_object.video.urls['1080p']));
          } else if (sel === 2) {
            this.touchedCustomVideoQuality = true;
            this.player.attachSource(this.absMedia(this.data_object.video.urls['720p']));
          } else if (sel === 1) {
            this.touchedCustomVideoQuality = true;
            this.player.attachSource(this.absMedia(this.data_object.video.urls['480p']));
          }

          this.mainVideo.currentTime = t;
          this.qualityoptions.querySelector('.active')?.classList?.remove('active');
          li.classList.add('active');
        });
      });
    }

    if (this.pipBtn) {
      this.pipBtn.addEventListener('click', () => {
        (this.mainVideo as any).requestPictureInPicture?.();
      });
    }

    if (this.fullScreenBtn) {
      this.fullScreenBtn.addEventListener('click', () => {
        this.container.classList.toggle('fullscreen');
        if (!document.fullscreenElement) {
          this.fullScreenBtn.classList.replace('fa-expand', 'fa-compress');
          this.container.requestFullscreen();
        } else {
          this.fullScreenBtn.classList.replace('fa-compress', 'fa-expand');
          document.exitFullscreen();
        }
      });
    }
  }

  /* ==============================================================
   *                         UI UTILITIES
   * ============================================================== */

  private hideControls(): void {
    if (this.mainVideo.paused) return;
    this.hideTimer = setTimeout(() => {
      this.container.classList.remove('show-controls');
    }, 3000);
  }

  private formatTime(time: number): string {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    const second = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const minute = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const hour = hours < 10 ? `0${hours}` : `${hours}`;
    if (hours === 0) return `${minute}:${second}`;
    return `${hour}:${minute}:${second}`;
  }

  private onTimeUpdate(e: Event): void {
    const v = e.target as HTMLVideoElement;
    if (!v) return;
    const { currentTime, duration } = v;
    if (!this.mainVideo.paused) {
      const percent = (currentTime / duration) * 100;
      if (this.progressBar) this.progressBar.style.width = `${percent}%`;
      if (this.currentVidTime) this.currentVidTime.innerText = this.formatTime(currentTime);
    }
  }

  private onLoadedData(): void {
    if (this.videoDuration) {
      this.videoDuration.innerText = this.formatTime(this.mainVideo.duration || 0);
    }
  }

  private onProgressBuffer(): void {
    try {
      if (!this.mainVideo.buffered || this.mainVideo.buffered.length === 0) return;
      const end = this.mainVideo.buffered.end(0);
      const pct = (end / (this.mainVideo.duration || 1)) * 100;
      if (this.progressBarLoaded) this.progressBarLoaded.style.width = `${pct}%`;
    } catch {}
  }



  private handleVideoMouseMove(e: MouseEvent): void {
    if (!this.progressArea) return;
    const rect = this.progressArea.getBoundingClientRect();
    const relX = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const pct = relX / rect.width;
    const previewTime = pct * (this.mainVideo.duration || 0);

    const hoverSpan = this.progressArea.querySelector('span') as HTMLElement;
    if (hoverSpan) {
      const bubbleHalf = 71.1111111111;
      let left = relX - bubbleHalf;
      left = Math.max(4, Math.min(rect.width - 80 - bubbleHalf, left));
      hoverSpan.style.left = `${left}px`;
    }

    const imgInSpan = this.progressArea.querySelector('.image-thumnail img') as HTMLImageElement;
    if (imgInSpan) {
      const imgNo = Math.max(1, Math.floor(previewTime / 10));
      imgInSpan.src = `/assets/Dash/img/image_${String(imgNo).padStart(3, '0')}.jpg`;
    }

    if (this.isScrubbing) this.onDragScrub(e);
  }


  private onDocumentMouseMove(e: MouseEvent): void {
    if (!this.isScrubbing) return;
    this.onDragScrub(e);
  }



  private toggleScrubbing(e: MouseEvent): void {
    if (!this.progressArea) return;

    const rect = this.progressArea.getBoundingClientRect();
    const relX = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const pct = relX / rect.width;

    this.isScrubbing = (e.buttons & 1) === 1;
    this.container.classList.toggle('scrubbing', this.isScrubbing);

    if (this.isScrubbing) {
      this.wasPaused = this.mainVideo.paused;
      this.mainVideo.pause();
      this.onDragScrub(e);
    } else {
      if (!this.wasPaused) {
        this.mainVideo.currentTime = pct * (this.mainVideo.duration || 0);
        this.mainVideo.play();
      }
    }
  }

  private onDocumentMouseUp(e: MouseEvent): void {
    if (!this.isScrubbing) return;
    this.toggleScrubbing(e);
  }

  private onDragScrub(e: MouseEvent): void {
    if (!this.progressArea) return;
    const rect = this.progressArea.getBoundingClientRect();
    const relX = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const pct = relX / rect.width;

    if (this.progressBar) this.progressBar.style.width = `${pct * 100}%`;
    this.mainVideo.currentTime = pct * (this.mainVideo.duration || 0);

    if (this.currentVidTime) {
      this.currentVidTime.innerText = this.formatTime(this.mainVideo.currentTime);
    }

    if (this.thumnailimg) {
      const imgNo = Math.max(1, Math.floor(this.mainVideo.currentTime / 10));
      this.thumnailimg.src = `/assets/Dash/img/image_${String(imgNo).padStart(3, '0')}.jpg`;
    }
  }

  /* ==============================================================
   *                    OPTIONAL ABR RE-ATTACHER
   * ============================================================== */

  private installPeriodicAbrReattach(): void {
    if (this.periodicAbrInterval) clearInterval(this.periodicAbrInterval);
    this.periodicAbrInterval = setInterval(() => {
      if (this.touchedCustomVideoQuality) return;

      const available = this.getAvailableBitrates();
      if (!available || available.length === 0) return;

      const top = available[0] || 0;
      const t = this.mainVideo.currentTime;

      if (top <= 4_000_000) {
        this.player.attachSource(this.absMedia(this.data_object.video.urls['1080p']));
      } else if (top >= 4_000_000 && top >= 1_200_000) {
        this.player.attachSource(this.absMedia(this.data_object.video.urls['720p']));
      } else {
        this.player.attachSource(this.absMedia(this.data_object.video.urls['480p']));
      }
      this.mainVideo.currentTime = t;

      this.setBitrate(top);
    }, 6000);
  }

  /* ==============================================================
   *                    BITRATE / NETWORK HELPERS
   * ============================================================== */

  private detectNetworkSpeed(): number | null {
    const conn =
      this.navigatorAny.connection ||
      this.navigatorAny.mozConnection ||
      this.navigatorAny.webkitConnection;
    if (conn) {
      const speedMbps = conn.downlink / 1024;
      return Math.round(speedMbps * 1000);
    }
    return null;
  }

  private getAvailableBitrates(): number[] {
    const infos = this.player.getBitrateInfoListFor('video');
    const networkSpeed = this.detectNetworkSpeed();
    const res: number[] = [];
    if (networkSpeed) {
      for (let i = 0; i < infos.length; i++) {
        if (infos[i].bitrate < networkSpeed) res.push(infos[i].bitrate);
      }
    } else if (infos.length) {
      res.push(infos[infos.length - 1].bitrate);
    }
    return res;
  }

  private getAllBitrates(): number[] {
    const infos = this.player.getBitrateInfoListFor('video');
    return infos.map((i: any) => i.bitrate);
  }

  private setBitrate(targetBitrate: number): void {
    const infos = this.player.getBitrateInfoListFor('video');
    let idx = infos.findIndex((i: any) => i.bitrate === targetBitrate);
    if (idx < 0) {
      let bestIdx = 0;
      let bestDiff = Number.MAX_SAFE_INTEGER;
      for (let i = 0; i < infos.length; i++) {
        const diff = Math.abs(infos[i].bitrate - targetBitrate);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestIdx = i;
        }
      }
      idx = bestIdx;
    }
    this.player.setQualityFor('video', idx);
  }

  /* ==============================================================
   *                    URL / KEY HELPERS
   * ============================================================== */

  private absMedia(rel: string): string {
    if (!rel) return rel;
    if (/^https?:\/\//i.test(rel)) return rel; // already absolute
    const cleaned = rel.replace(/^\/?assets\/?/, '').replace(/^\/+/, '');
    return `${environment.media_url.replace(/\/+$/, '')}/${cleaned}`;
  }
private hexToBase64Url(hex: string): string {
  const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map(b => parseInt(b, 16)));
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
/** Fetch encryption keys dynamically from backend */
/** Fetch encryption keys dynamically from backend */
/** 🎯 Fetch key from backend dynamically with device info */
private async fetchVideoKey(
  videoId: string,
  quality: string,
  kid: string,
  keyHex:string
): Promise<{ kid: string; key: string }> {
  try {
    const licenseUrl = `${environment.baseurl}video/get-key`;

    // 🌍 Get IP
    let ipAddress = 'unknown';
    try {
      const ipRes = await fetch('https://api64.ipify.org?format=json');
      const ipJson = await ipRes.json();
      ipAddress = ipJson.ip;
    } catch (e) {
      console.warn('⚠️ Could not get IP address:', e);
    }

    // 💻 Extract environment info
    const userAgent = navigator.userAgent || 'unknown';
    const platform = navigator.platform || 'unknown';
    const appVersion = navigator.appVersion || 'unknown';
    const browser = this.detectBrowser(userAgent);
    const deviceName = this.detectDevice(userAgent);
    const deviceId = crypto.randomUUID(); // Unique session/device ID

    // 👤 Extract user info from data_object
    const username = this.data_object?.username || 'unknown';
    const email = this.data_object?.email || 'unknown';
    const query_token = this.data_object?.query_token || '';

    // 📦 Prepare final payload
    const payload = {
      "kids":kid,                 // ✅ Correct key ID
      keyHex:[keyHex],                 // ✅ Correct key ID
      videoId,             // string
      quality,             // e.g. "1080p"
      username,
      email,
      query_token,
      deviceId,
      deviceName,
      platform,
      browser,
      appVersion,
      ipAddress,
      userAgent,
    };

    console.log('📡 Sending /video/get-key request:', payload);

    const res = await fetch(licenseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const data = await res.json();

    // Backend returns something like:
    // { keys: [{ kid: "<b64url>", k: "<b64url>" }], type: "temporary" }
    if (!data?.keys?.[0]?.kid || !data?.keys?.[0]?.k) {
      throw new Error('Malformed key response from server');
    }

    const keyInfo = data.keys[0];
    console.log('🔑 Key fetched from backend:', keyInfo);

    return { kid: keyInfo.kid, key: keyInfo.k };
  } catch (err) {
    console.error('❌ fetchVideoKey failed:', err);
    return { kid: '', key: '' };
  }
}


/** 🧭 Detect browser from UA string */
private detectBrowser(ua: string): string {
  if (/chrome|crios|crmo/i.test(ua)) return 'Chrome';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
  if (/edg/i.test(ua)) return 'Edge';
  if (/opera|opr/i.test(ua)) return 'Opera';
  return 'Unknown';
}

/** 📱 Detect device type/name from UA */
private detectDevice(ua: string): string {
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/windows/i.test(ua)) return 'Windows PC';
  if (/macintosh|mac os x/i.test(ua)) return 'Mac';
  return 'Unknown Device';
}




}
