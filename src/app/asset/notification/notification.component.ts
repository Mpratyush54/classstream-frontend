import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { LoaderService } from 'src/app/loader/loader.service';
import { StogageService } from 'src/app/services/stogage.service';
import { NotificationService } from 'src/app/teacher/services/notification.service';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  // standalone:true
})
export class NotificationComponent {
   constructor(  private Routes:Router , private notification:NotificationService  ,    private swPush: SwPush,       private localstorage :StogageService ,public loaderservice:LoaderService  ) {


          }
notifiactionnumber:number
notifiactionall
name = this.localstorage.teacher_get('teacher_name')
email = this.localstorage.teacher_get('teacher_email')
private readonly publicKey = 'BL1k4svygg7piYjqcY8MH8XW7QAt5T9QU20hWn9wQgLgw6zgVpOOHYmGza1kknjWuc1S-rkkKKazzqGBXpEEWzU';
  ngOnInit(): void {
    this.notification.notificationno().subscribe((res: any) => {
      console.log(res)
      if (res == undefined) {
        
        this.notifiactionnumber = 0
      } else {
        document.getElementById('notification').removeAttribute('style')

        this.notifiactionnumber = res

      }

    })
    this.notification.notificationall().subscribe((res: any) => {
      console.log(res)


      this.notifiactionall = res


    })
    if (!this.swPush.isEnabled) {
      console.log('Notification is not enabled');
      return;
    }
    var reg = localStorage.getItem('regestration')
    if (reg == '') {
      this.swPush
        .requestSubscription({
          serverPublicKey: this.publicKey,
        })
        .then((sub) => {
          console.log(sub);

          localStorage.setItem('regestration', 'true')
          this.notification.notification(sub).subscribe((res: any) => {

          })
        })
        .catch((err) => console.log(err));



    }
  }
    teacherroute2(data, id) {
    this.notification.onclick(id).subscribe((res: any) => {
    })
    window.open(data, '_blank');
  }
}
