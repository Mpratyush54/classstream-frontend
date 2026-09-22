import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StogageService } from 'src/app/services/stogage.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient , private Routes: Router ,private localstorage :StogageService) { }

  // Lazily read credentials — constructor snapshot goes stale after login
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

 divices(){
  
  let url = environment.baseurl+'student/settings';
console.log(url);

   return this.http.post(url ,{
    student_username:this.usernames,
    student_email:this.emails ,
    student_query_token: this.query_tokens    

    }).pipe(
      map((data: any) => {
        if(data){
if(data.status == true){
  if(data.error == false){
    return data
  }
}
        }
      }), catchError( response => {



      return throwError( 'Something went wrong!' );




      })
   )
}
}
