import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StogageService } from 'src/app/services/stogage.service';
import { io } from 'socket.io-client';
import { data } from 'jquery';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LiveService {

  constructor(private http: HttpClient, private Routes: Router, private localstorage: StogageService) { }


  get usernames(): string {
    try { return this.localstorage.student_get('student_username') ?? ''; } catch { return ''; }
  }
  get emails(): string {
    try { return this.localstorage.student_get('student_email') ?? ''; } catch { return ''; }
  }
  get query_tokens(): string {
    try { return this.localstorage.student_get('student_query_token') ?? ''; } catch { return ''; }
  }
  get student_class(): string {
    try { return this.localstorage.student_get('student_class') ?? ''; } catch { return ''; }
  }

  details() {




    let url = environment.baseurl + `student/live/index`;
    return this.http.post(url, {
      student_username:this.usernames,
      student_email:this.emails ,
      student_query_token: this.query_tokens,
      student_class: this.student_class
    }).pipe(
      map((data: any) => {
console.log(data);



        if (data.status == true) {


          return data


        }



      }), catchError(error => {
        console.log(error);
        if (error.message == `Http failure response for ${url}: 0 Unknown Error`) {
          return
        } else {
          return throwError(error.message || "Server Error")
        }
      }))
  }
  details_main(id) {




    let url = environment.baseurl + `student/live/index_main`;
    return this.http.post(url, {
      student_username:this.usernames,
      student_email:this.emails ,
      student_query_token: this.query_tokens,
      student_class: this.student_class,
      id: id,
    }).pipe(
      map((data: any) => {

console.log(data);


        if (data.status == true) {


          return data


        }



      }), catchError(error => {
        console.log(error);
        if (error.message == `Http failure response for ${url}: 0 Unknown Error`) {
          return
        } else {
          return throwError(error.message || "Server Error")
        }
      }))
  }
  



  // this is cchat paart of thing — lazy connect so we don't open a socket on every page load
  private _socket: ReturnType<typeof io> | null = null;
  private get socket() {
    if (!this._socket) {
      this._socket = io(environment.soket_url, { autoConnect: true });
    }
    return this._socket;
  }

  joinroom(room) {
    var data = { user: this.usernames, room: room }
    this.socket.emit('join', data)
  }
  revoverchat(room) {
    var data = { user: this.usernames, room: room }
    this.socket.emit('chat-details', data)
  }

  newuserjoined() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('New User Joined', (data) => {
        observer.next(data)
      })
      return () => { this.socket.disconnect(); }
    })
    return observable;
  }
  banusercall() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('banned', (data) => {
        observer.next(data)
      })
      return () => { this.socket.disconnect(); }
    })
    return observable;
  }
  sendmesg(room, msg) {
    var data = { user: this.usernames, room: room, message: msg }
    this.socket.emit('Message', data)
  }

  newmsg(room) {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('new message', (data) => {
        let url = environment.baseurl + `teacher/chat/save-chat`;
        var user = data.user
        var msg = data.message
        this.http.post(url, {
          username: this.usernames,
          email: this.emails,
          query_token: this.query_tokens,
          room: room,
          user: user,
          message: msg,
        })

        observer.next(data)
      })
      return () => { this.socket.disconnect(); }
    })




    return observable;
  }
  priviousmsg() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('preveious chat', (data) => {

        observer.next(data)
      })
      return () => { this.socket.disconnect(); }
    })



    return observable;
  }

  bancheck(room){
    let url = environment.baseurl + `bancheck`;
    return this.http.post(url, {
      username: this.usernames,
      email: this.emails,
      query_token: this.query_tokens,
      room:room
    }).pipe(
      map((data: any) => {

console.log(data);


        if (data.status == true) {
return data
         


        }



      }), catchError(error => {
        console.log(error);
        if (error.message == `Http failure response for ${url}: 0 Unknown Error`) {
          return
        } else {
          return throwError(error.message || "Server Error")
        }
      }))
  }
}
