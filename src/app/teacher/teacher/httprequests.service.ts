import { Injectable } from '@angular/core';
import { HttpClient ,HttpEventType } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import  'rxjs/add/observable/throw';
import { Router  } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StogageService } from 'src/app/services/stogage.service';

@Injectable({
  providedIn: 'root'
})
export class HttprequestsService {

  constructor(private http: HttpClient, private Routes: Router,private localstorage :StogageService) { }
  private get usernames(): string {
    try { return this.localstorage.teacher_get('teacher_username') ?? ''; } catch { return ''; }
  }
  private get emails(): string {
    try { return this.localstorage.teacher_get('teacher_email') ?? ''; } catch { return ''; }
  }
  private get query_tokens(): string {
    try { return this.localstorage.teacher_get('teacher_query_token') ?? ''; } catch { return ''; }
  }
 
  request(url , body){
  
    return this.http.post(url ,body).pipe(
      map((data: any) => {
        // console.log('connection made');


      }), catchError( error => {
        console.log(error);
        
if(error.message == `Http failure response for : 0 Unknown Error`){
  
}else{
  return Observable.throw(error.message || "Server Error")
    
     
}

    
      
      }))
  }
}
