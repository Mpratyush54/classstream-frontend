import { Injectable } from '@angular/core';

import { HttpClient , HttpEventType } from '@angular/common/http';
import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import  * as $  from 'jquery'
import { Router  } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StogageService } from 'src/app/services/stogage.service';

@Injectable({
  providedIn: 'root'
})
export class UploadVideoService {

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
  upload_video(file , id1){

    const fd = new FormData()
    fd.append('file' , file , file.name )
    fd.append('username' , this.usernames  )
    fd.append('email' , this.emails  )
    fd.append('query_token' , this.query_tokens  )

    let url = environment.baseurl+`teacher/upload_video_video/${id1}`;
    return this.http.post(url ,fd,{
      reportProgress:true,
      observe:'events'
    }).pipe(
      map((data: any) => {

        
        if(data.type === HttpEventType.UploadProgress ){
    let value =Math.round(data.loaded / data.total * 100  )+'%'
 
        // document.getElementById('progressbarvideo').style.width=`${value}`
        
       
        }else if(data.type === HttpEventType.Response){

return data

        }
    
    
    
      }), catchError( response => {
console.log(response);

    
   
    
    
      return throwError( 'Something went wrong!' );
       
    
    
      
      }))
  }
  uploadsssss_video(Chapter_Names , Titles,Chapter_No,Class){
    

    let url = environment.baseurl+'teacher/upload-data';
   return this.http.post(url ,{
     
    username:this.usernames,
    email:this.emails ,
    query_token: this.query_tokens,
    Chapter_Name: Chapter_Names,
    Title   :Titles  ,
    Chapter_No:Chapter_No,
    Class   : Class
    }).pipe(
      map((data: any) => {
        if(data.status == true){
          if(data.error == false){
            this.Routes.navigate([`teacher/video-upload-file/${data.id}`])
           
          }
        }



      }), catchError( response => {

  
  
      return throwError( 'Something went wrong!' );
       


      
      })
   )
  }
}
