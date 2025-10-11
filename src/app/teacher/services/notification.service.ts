import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StogageService } from 'src/app/services/stogage.service';
import { DeviceDetectorService} from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
private usernames: string;
private emails: string;
private query_tokens: string;

  constructor(private http:HttpClient ,private Routes:Router ,private localstorage :StogageService,private DeviceDetectorService:DeviceDetectorService ){
    this.loadUserData();
   }

private loadUserData() {
  this.usernames = this.localstorage.teacher_get('teacher_username') || '';
  this.emails = this.localstorage.teacher_get('teacher_email') || '';
  this.query_tokens = this.localstorage.teacher_get('teacher_query_token') || '';
  console.log(this.localstorage.teacher_get('teacher_username'));
  console.log(this.usernames);
  console.log(this.localstorage.teacher_get('teacher_email'));
  console.log(this.emails);
  console.log(this.localstorage.teacher_get('teacher_query_token') );
  console.log(this.query_tokens);
  
}

know_class(username){



      let url = environment.baseurl+`teacher/notification/know_class`;

      return this.http.post(url ,{
        username:this.usernames,
        email:this.emails ,
        query_token: this.query_tokens,
        data:username
        }).pipe(
          map((data: any) => {

      if(data.status == true)   {
        if(data.error == false){
return data
        }
      }

          }), catchError( response => {

            return response


          }))

}
notification_see(data){



      let url = environment.baseurl+`teacher/notification/check-notifaction-custom2`;

      return this.http.post(url ,{
        username:this.usernames,
        email:this.emails ,
        query_token: this.query_tokens,
        data:data
        }).pipe(
          map((data: any) => {

      if(data.status == true)   {
        if(data.error == false){
return data
        }
      }

          }), catchError( response => {

            return response


          }))

}
notification(datas:any){

  const useragent = window.navigator.userAgent;


  console.log(this.usernames);
  console.log(this.emails);
  console.log(this.query_tokens);

      let url = environment.baseurl+`teacher/notification/data`;

      return this.http.post(url ,{
        username:this.usernames,
        email:this.emails ,
        query_token: this.query_tokens,
        data: datas,
        useragent:this.DeviceDetectorService.getDeviceInfo()

        }).pipe(
          map((data: any) => {

      if(data.status == true)   {
        if(data.error == false){
        console.log('sucss');

        }
      }

          }), catchError( response => {

            return response


          }))

}
  notificationno(){

    let url = environment.baseurl+`teacher/notification/check-notifaction-all`;

    return this.http.post(url ,{
      username:this.usernames,
      email:this.emails ,
      query_token: this.query_tokens

      }).pipe(
        map((data: any) => {

    if(data.status == true)   {
      if(data.error == false){
    localStorage.setItem('lastroutetime' , data.time)

        if(data.notify){

          var count = Object.keys(data.notify).length;
    return count

        }
      }
    }

        }), catchError( response => {

          return response


        }))

  }
  notificationall(){



        let url = environment.baseurl+`teacher/notification/check-notifaction-all`;

        return this.http.post(url ,{
          username:this.usernames,
          email:this.emails ,
          query_token: this.query_tokens

          }).pipe(
            map((data: any) => {

        if(data.status == true)   {
          if(data.error == false){

            if(data.notify){

        return data.notify

            }
          }
        }

            }), catchError( response => {

              return response


            }))

      }
      onclick(id){



            let url = environment.baseurl+`teacher/notification/seen`;

            return this.http.post(url ,{
      username:this.usernames,
          email:this.emails ,
          query_token: this.query_tokens,
              id: id

              }).pipe(
                map((data: any) => {


            if(data.status == true)   {
              if(data.error == false){

              }
            }

                }), catchError( response => {

                  return response


                }))

          }
          notification_send(data){



                let url = environment.baseurl+`teacher/notification/new`;

                return this.http.post(url ,{
          username:this.usernames,
              email:this.emails ,
              query_token: this.query_tokens,
data:data
                  }).pipe(
                    map((data: any) => {


                if(data.status == true)   {
                  if(data.error == false){
               return data
                  }
                }

                    }), catchError( response => {

                      return response


                    }))

          }
          notification_custom(){



                let url = environment.baseurl+`teacher/notification/check-notifaction-custom`;

                return this.http.post(url ,{
          username:this.usernames,
              email:this.emails ,
              query_token: this.query_tokens,
                  }).pipe(
                    map((data: any) => {


                if(data.status == true)   {
                  if(data.error == false){
               return data
                  }
                }

                    }), catchError( response => {

                      return response


                    }))

          }
private checkpermission(){
  Notification.requestPermission().then()

}
 routes(url){
  this.Routes.navigateByUrl(url)

}
}
