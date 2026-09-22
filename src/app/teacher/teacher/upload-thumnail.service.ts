import { Injectable } from '@angular/core';

import { HttpClient ,HttpErrorResponse,HttpEventType } from '@angular/common/http';
import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import  'rxjs/add/observable/throw';
import  * as $  from 'jquery'
import { Router  } from '@angular/router';
import { event } from 'jquery';
import { environment } from '../../../environments/environment';
import { StogageService } from 'src/app/services/stogage.service';

@Injectable({
  providedIn: 'root'
})

export class UploadThumnailService {
   json = 'Server faild to respond . Please report us at <a> link</a>' 

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
  upload_thumnail(file , id1){


    const fd = new FormData()
    fd.append('file' , file , file.name )
    fd.append('username' , this.usernames  )
    fd.append('email' , this.emails  )
    fd.append('query_token' , this.query_tokens  )
 
    let url = environment.baseurl+`teacher/upload_video_thumnail/${id1}`;
    return this.http.post(url ,fd,{
      reportProgress:true,
      observe:'events'
    }).pipe(
      map((data: any) => {
        // console.log('connection made');

        
        if(data.type === HttpEventType.UploadProgress ){

        
       
        }else if(data.type === HttpEventType.Response){
return data

        }
    
    
    
      }), catchError( error => {
        console.log(error);
        
if(error.message == `Http failure response for ${url}: 0 Unknown Error`){
return this.json
  
}else{
  return Observable.throw(error.message || "Server Error")
    

}

    
      
      }))
  }

}
