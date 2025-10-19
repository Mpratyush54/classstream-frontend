import { Component, OnInit, signal, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadThumnailService } from '../services/upload-thumnail.service';
import { UploadVideoService } from '../services/upload-video.service';
import { VerifiyPassService } from '../services/verifiy-pass.service';

// ✅ Modal Component
@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ message_heading }}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body"><p>{{ message }}</p></div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="go()">Close</button>
    </div>
  `,
})
export class NgbdModalContent {
  @Input() message = '';
  @Input() message_heading = '';
  @Input() navigate_url = '';

  constructor(public activeModal: NgbActiveModal, private router: Router) {}
  go() {
    this.router.navigateByUrl(this.navigate_url || 'teacher/videos');
  }
}

// ✅ Interface
interface Alert {
  type: 'success' | 'danger' | 'info' | 'warning';
  message: string;
}

// ✅ Main Component
@Component({
  selector: 'app-video-upload-file',
  standalone: true,
  imports: [CommonModule, NgbAlertModule],
  templateUrl: './video-upload-file.component.html',
  styleUrls: ['./video-upload-file.component.css'],
})
export class VideoUploadFileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal);
  private thumbService = inject(UploadThumnailService);
  private videoService = inject(UploadVideoService);
  private verifyService = inject(VerifiyPassService);

  id = '';
  alerts = signal<Alert[]>([]);
  progress = signal(0);
  isUploading = signal(false);
  dragOver = signal(false);

  vedouploded = false;
  themouploded = false;
  video_not_up = true;
  warningMessage = '';
  loadingStatus = false;

  selectedThumb: File | null = null;
  selectedVideo: File | null = null;

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.checkUploadStatus();
  }

  /** ✅ Check current upload status using verify service */
  checkUploadStatus() {
    this.loadingStatus = true;
    this.verifyService.verify_data(this.id).subscribe({
      next: (res) => {
        this.loadingStatus = false;

        if (res?.status && res.data) {
          const { video, thumbnail, processed } = res.data;

          this.vedouploded = video;
          this.themouploded = thumbnail;
          this.video_not_up = !(video && thumbnail);

          // UI warnings
          if (processed || (video && thumbnail)) {
            this.warningMessage = '⚠️ Both video and thumbnail are already uploaded. Uploads are locked.';
          } else if (video && !thumbnail) {
            this.warningMessage = '⚠️ Video uploaded. Please upload the thumbnail.';
          } else if (!video && thumbnail) {
            this.warningMessage = '⚠️ Thumbnail uploaded. Please upload the video.';
          } else {
            this.warningMessage = '';
          }
        } else {
          this.warningMessage = '⚠️ Verification failed. Please try again later.';
        }
      },
      error: (err) => {
        console.error('Verification error:', err);
        this.loadingStatus = false;
        this.warningMessage = '⚠️ Server error during verification.';
      },
    });
  }

  /** ✅ Alert Utility */
  addAlert(message: string, type: Alert['type']) {
    this.alerts.update((a) => [...a, { message, type }]);
    setTimeout(() => this.alerts.update((a) => a.slice(1)), 5000);
  }

  // === 🖼️ Thumbnail Upload ===
  onThumbSelect(file: File) {
    if (file.type !== 'image/jpeg') {
      this.addAlert('Please select a JPEG image only.', 'danger');
      return;
    }
    this.selectedThumb = file;
  }

  uploadThumbnail() {
    if (!this.selectedThumb) return this.addAlert('No thumbnail selected.', 'danger');

    this.thumbService.upload_thumnail(this.selectedThumb, this.id).subscribe({
      next: (res) => {
        if (res?.body?.status && !res.body.error) {
          this.themouploded = true;
          this.addAlert('Thumbnail uploaded successfully!', 'success');
          this.checkUploadStatus();
        } else {
          this.addAlert(res?.body?.mes || 'Thumbnail upload failed.', 'danger');
        }
      },
      error: () => this.addAlert('Thumbnail upload error.', 'danger'),
    });
  }

  // === 🎥 Video Upload ===
  onVideoSelect(file: File) {
    if (file.type !== 'video/mp4') {
      this.addAlert('Only MP4 video files allowed.', 'danger');
      return;
    }
    this.selectedVideo = file;
  }

  async uploadVideo() {
    if (!this.selectedVideo) return this.addAlert('No video selected.', 'danger');
    const sizeMB = Math.round(this.selectedVideo.size / 1024 / 1024);
    if (!confirm(`Upload ${sizeMB} MB video? This may take time depending on your connection.`)) return;

    this.isUploading.set(true);
    this.progress.set(0);

    try {
      await this.videoService.upload_video(this.selectedVideo, this.id, (pct) => this.progress.set(pct));
      this.vedouploded = true;
      this.addAlert('Video uploaded successfully!', 'success');
      this.checkUploadStatus();
    } catch (err) {
      console.error(err);
      this.addAlert('Video upload failed.', 'danger');
    } finally {
      this.isUploading.set(false);
    }
  }

  // === ✅ Verify and Finish ===
  verifyAndFinish() {
    this.verifyService.check_data(this.id).subscribe({
      next: (res) => {
        if (res.status && !res.error) {
          this.addAlert(res.mes || 'Upload verified.', 'success');
          const modalRef = this.modalService.open(NgbdModalContent);
          modalRef.componentInstance.message = res.mes || 'Upload verified successfully.';
          modalRef.componentInstance.message_heading = 'Success';
          modalRef.componentInstance.navigate_url = 'teacher/videos';
        }
      },
      error: () => this.addAlert('Verification request failed.', 'danger'),
    });
  }

  // === 🖱️ Drag-and-Drop ===
  handleDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(true);
  }
  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(false);
  }
  handleDrop(event: DragEvent, type: 'video' | 'thumb') {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    type === 'video' ? this.onVideoSelect(file) : this.onThumbSelect(file);
  }
}
