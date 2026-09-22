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
export class NotesServiceStudent {

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

 
  index(){
  
    let url = environment.baseurl+'student/notes';
// console.log(url);

     return this.http.post(url ,{
      student_username:this.usernames,
      student_email:this.emails ,
      student_query_token: this.query_tokens,
      class: this.student_class

      }).pipe(
        map((data: any) => {
          
  if(data.status == true){

    return data
  }

        }), catchError( response => {



        return throwError( 'Something went wrong!' );




        })
     )
  }
  index_idividual(id){
  
    let url = environment.baseurl+'student/notes/idividual';

     return this.http.post(url ,{
      student_username:this.usernames,
      student_email:this.emails ,
      student_query_token: this.query_tokens,
      class: this.student_class,
      id: id
      }).pipe(
        map((data: any) => {
          
  if(data.status == true){

    return data
  }

        }), catchError( response => {



        return throwError( 'Something went wrong!' );




        })
     )
  }
}
