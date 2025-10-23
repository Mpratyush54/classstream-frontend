import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HlsjsPlyrDriver } from '../../../student/video/play-setup/play-setup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LiveService } from '../../services/live.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../new-notification/new-notification.component';
import { NotificationService } from '../../services/notification.service';
import { VideoPlayerHlsComponent } from 'src/app/asset/video.player.hls/video.player.hls.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  standalone: true,
  imports: [
    VideoPlayerHlsComponent,
    CommonModule,
    FormsModule
  ]
})
export class CreateComponent implements OnInit, AfterViewInit {
  @ViewChild('mychatdiv', { static: false }) mychatdiv!: ElementRef<HTMLDivElement>;

  chat = true;
  live = false;
  banned = false;
  uname = 'Teacher';
  title = '';
  stream_url = '';
  stream_key = '';
  id = this.route.snapshot.params['id'];
  messagetext = '';
  messagearry: Array<{ user: String; message: String }> = [];
  pmesage: Array<{ user: String; message: String }> = [];
  mesage: Array<{ user: String; message: String }> = [];

  private class: string = '';
  private name: string = '';

  constructor(
    private route: ActivatedRoute,
    private service: LiveService,
    private modalService: NgbModal,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.joinRoom();
    this.setupChatListeners();
    this.loadStreamDetails();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  // 🔄 Scroll chat smoothly to bottom
  private scrollToBottom(): void {
    try {
      if (this.mychatdiv?.nativeElement) {
        setTimeout(() => {
          const el = this.mychatdiv.nativeElement;
          el.scrollTop = el.scrollHeight;
        }, 100);
      }
    } catch (err) {
      console.warn('Scroll error:', err);
    }
  }

  private joinRoom(): void {
    this.service.joinroom(this.id);
    this.service.revoverchat(this.id);
  }

  private setupChatListeners(): void {
    // 🧍 Banned check
    this.service.bancheck(this.id).subscribe((res) => {
      if (res?.data === true && res?.error === true && res?.message === '234fhfhfhdyvv') {
        const modalRef = this.modalService.open(NgbdModalContent);
        modalRef.componentInstance.name =
          '⚠️ You were banned by the admin from the chat. Repeated bans may lead to suspension.';
        this.banned = true;
      }
    });

    // 🚫 Ban user event (realtime)
    this.service.banusercall().subscribe((res) => {
      if (res) {
        const modalRef = this.modalService.open(NgbdModalContent);
        modalRef.componentInstance.name =
          '⚠️ You were banned by the admin from the chat.';
        this.banned = true;
      }
    });

    // 👋 New user joined
    this.service.newuserjoined().subscribe((res) => {
      this.messagearry.push(res);
      this.scrollToBottom();
    });

    // 💬 New incoming message
    this.service.newmsg(this.id).subscribe((res) => {
      this.mesage.push(res);
      this.scrollToBottom();
    });

    // 📜 Previous chat messages
    this.service.priviousmsg().subscribe((res) => {
      this.pmesage = [res];
      this.scrollToBottom();
    });
  }

  private loadStreamDetails(): void {
    this.service.details(this.id).subscribe((res) => {
      if (res?.status === true && res?.data) {
        this.stream_key = res.data.stream_key;
        this.stream_url = res.data.stream_url;
        this.title = res.data.Title;
        this.class = res.data.class;
        this.name = res.data.name;
      }
    });
  }

  // 📩 Send chat message
  sendmessage(formValue: any): void {
    if (!formValue?.Title?.trim()) return;
    this.service.sendmesg(this.id, formValue.Title.trim());
    this.mesage.push({ user: this.uname, message: formValue.Title });
    this.scrollToBottom();
    this.messagetext = '';
  }

  // 🚫 Ban / Warn / Control actions
  banuser(user_id: String, message: String, id: String): void {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = '🚫 User Banned';
    this.service.banuser(user_id, message, this.id, id);
  }

  warnuser(user_id: String): void {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = `⚠️ Warning sent to user ${user_id}`;
  }

  disablechat(): void {
    this.chat = false;
  }

  enablechat(): void {
    this.chat = true;
  }

  // 🔔 Start live session and send notifications
  playedtrue(): void {
    this.notificationService
      .notification_send({
        Body: `Dear Students, Your teacher ${this.name} is live now.`,
        Title: this.title,
        class: this.class,
      })
      .subscribe((res) => {
        if (res?.status === true && res?.error === false && res?.mes) {
          const modalRef = this.modalService.open(NgbdModalContent);
          modalRef.componentInstance.name = `✅ Notifications sent successfully! ID: ${res.mes}`;
        }
      });

    this.live = true;
  }

  pausetrue(): void {
    this.router.navigateByUrl('/teacher/live');
  }

  // 📋 Copy text utility
  copy(data: string): void {
    navigator.clipboard.writeText(data);
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = '📋 Copied: ' + data;
  }
}
