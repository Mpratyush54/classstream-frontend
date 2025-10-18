import { Component, Input, OnInit , ViewChild} from '@angular/core';
// import { PlyrComponent } from 'ngx-plyr';
import { SimplebarAngularModule } from 'simplebar-angular';

import { HlsjsPlyrDriver } from '../../../student/video/play-setup/play-setup.component'
import Hls from 'hls.js';
import { ActivatedRoute, Router } from '@angular/router';
import { LiveService } from '../../service/live.service';

import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from 'src/app/teacher/new-notification/new-notification.component';
import { Title } from '@angular/platform-browser';
import { data } from 'jquery';
import { MessageArray } from 'src/app/models/MessageArray';

@Component({
  selector: 'app-live-join',
  templateUrl: './live-join.component.html',
  styleUrls: ['./live-join.component.css'],
  standalone:false
})
export class LiveJoinComponent implements OnInit {
  @ViewChild('mychatdiv') mychatdiv
  // // http://localhost:4200/teacher/live/3122462
  constructor(private route: ActivatedRoute, private service: LiveService, private modalService: NgbModal, private Routes: Router, ) { }
  live: boolean = false
  banned = false
  private class
  private name
  uname = 'hellothgfbv'
  title
  stream_url
  stream_key
  sources: Plyr.Source[]
  messagearry: MessageArray = []
  pmesage
  messagetext: String
  mesage: MessageArray = []
  ngOnInit(): void {



    this.service.joinroom(this.id);
    this.service.revoverchat(this.id);

    this.service.bancheck(this.id).subscribe((res) => {
      
      if (res) {
        console.log(res);

        if (res.data = true) {

          if (res.error == true) {
            if (res.message = '234fhfhfhdyvv') {
              const modalRef = this.modalService.open(NgbdModalContent);
              modalRef.componentInstance.name = `Dear User You were banned by the admin from the chat for this class and if found to be repeatedly banned by the admin your id will be suspended`;
              this.banned = true
            }
          }
        }
      }

    })

    this.service.banusercall().subscribe((res) => {
      if(res){
      const modalRef = this.modalService.open(NgbdModalContent);
      modalRef.componentInstance.name = `Dear User You were banned by the admin from the chat for this class and if found to be repeatedly banned by the admin your id will be suspended`;
      this.banned = true}
    })


    this.service.newuserjoined().subscribe((res) => {
      this.messagearry.push(res)
      this.mychatdiv.nativeElement.scrollTop = this.mychatdiv.nativeElement.scrollHeight+200;

    })


    this.service.newmsg(this.id).subscribe((res) => {

      this.mesage.push(res)
      this.mychatdiv.nativeElement.scrollTop = this.mychatdiv.nativeElement.scrollHeight+200;

    })

    this.service.priviousmsg().subscribe((res) => {      

      this.pmesage = res

      
      this.mychatdiv.nativeElement.scrollTop = this.mychatdiv.nativeElement.scrollHeight+200+50;
      
    })
    this.service.details_main(this.id).subscribe((res) => {
      console.log()

      if (res.status == true) {
        this.stream_key = res.data.stream_key
        this.stream_url = res.data.stream_url
        this.title = res.data.Title
        this.class = res.data.class
        this.name = res.data.name
        this.sources = [{
          type: 'video',
          src: environment.live_url + '/' + res.data.stream_key + '/index.m3u8'
        }];



      }
    })

  }
  id = this.route.snapshot.params['id']
  sendmessage(value) {


    this.service.sendmesg(this.id, value.Title);
    this.messagetext = ''
  }
  plyr1: Plyr;

  options: Plyr.Options = {
    autoplay: true,
    quality: {
      default: 360,
      options: [1080, 720, 480, 360],

    }


  };

  poster = 'https://bitdash-a.akamaihd.net/content/sintel/poster.png';


  hlsjsDriver2 = new HlsjsPlyrDriver(true);


  warnuser(user_id) {

  }





  languageChanged(driver: HlsjsPlyrDriver, plyr: Plyr) {
    setTimeout(() => driver.hls.subtitleTrack = plyr.currentTrack, 50);
  }
  playedtrue() {

    this.played()
    this.play()
    this.live = true
  }
  pausetrue() {
    this.Routes.navigateByUrl('/teacher/live')

  }
  played() {

    this.hlsjsDriver2.load(this.sources[0].src);

  }
  play() {
    if (this.sources) {
      this.plyr1.play()
    }
  }


}
