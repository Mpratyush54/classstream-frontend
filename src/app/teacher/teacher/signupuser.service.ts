import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { StogageService } from 'src/app/services/stogage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignupuserService {

  constructor(private http:HttpClient ,private Routes:Router ,private localstorage :StogageService) { }
private get usernames(): string {
    try { return this.localstorage.teacher_get('teacher_username') ?? ''; } catch { return ''; }
  }
  private get emails(): string {
    try { return this.localstorage.teacher_get('teacher_email') ?? ''; } catch { return ''; }
  }
  private get query_tokens(): string {
    try { return this.localstorage.teacher_get('teacher_query_token') ?? ''; } catch { return ''; }
  }
  loadindex(){

    
    let url = environment.baseurl+`teacher/signup/index`;

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
  loaduser(student_username){

    
    let url = environment.baseurl+`teacher/signup/user-search`;

    return this.http.post(url ,{
      username:this.usernames,
      email:this.emails ,
      query_token: this.query_tokens,
      student_username:student_username
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
}

